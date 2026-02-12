import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { glob } from "glob";
import path from "path";
import { execSync } from "child_process";
import fs from "fs";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173/admision-epg",

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      // 🔍 Task para buscar archivos descargados
      on("task", {
        getAdmissionConfig() {
          const configPath = path.join(process.cwd(), "src", "config", "admission.js");
          const content = fs.readFileSync(configPath, "utf8");
          const match = content.match(/periodo:\s*'([^']+)'/);
          return match ? match[1] : null;
        },
        findExcel(pattern) {
          const files = glob.sync(pattern);
          return files.length > 0 ? path.resolve(files[0]) : null;
        },
        setupVoucher({ num_iden, concepto_pago_id }) {
          const voucherNum = num_iden.substring(0, 7);
          const phpCode = `
            try {
                $dni = '${num_iden}';
                $postulante = App\\Models\\Postulante::where('num_iden', $dni)->first();
                if ($postulante) {
                    App\\Models\\Inscripcion::where('postulante_id', $postulante->id)->delete();
                }
                App\\Models\\Voucher::updateOrCreate(
                    ['num_iden' => $dni],
                    [
                        'numero' => '${voucherNum}',
                        'concepto_pago_id' => ${concepto_pago_id},
                        'estado' => 1,
                        'fecha_pago' => now()->format('Y-m-d'),
                        'agencia' => '9999',
                        'nombre_completo' => 'CYPRESS TEST USER',
                        'monto' => 250.00,
                        'hora_pago' => '10:00:00',
                        'cajero' => '0001'
                    ]
                );
                echo 'Voucher creado exitosamente';
            } catch (\\Exception $e) {
                echo 'Error en setupVoucher: ' . $e->getMessage();
                exit(1);
            }
          `;
          const cmd = `php artisan tinker --execute="${phpCode.replace(/\n/g, '')}"`;
          try {
            const output = execSync(cmd, { cwd: path.join(process.cwd(), "..", "api") });
            return output.toString();
          } catch (e) {
            throw new Error(e.message);
          }
        },
        clearTestData(num_iden) {
          const phpCode = `
            $dni = '${num_iden}';
            $p = App\\Models\\Postulante::where('num_iden', $dni)->first();
            if ($p) {
                App\\Models\\Inscripcion::where('postulante_id', $p->id)->delete();
                App\\Models\\Documento::where('postulante_id', $p->id)->delete();
                App\\Models\\PreInscripcion::where('postulante_id', $p->id)->delete();
                $p->delete();
            }
            $vouchers = App\\Models\\Voucher::where('num_iden', $dni)->get();
            foreach($vouchers as $v) {
                App\\Models\\Inscripcion::where('voucher_id', $v->id)->delete();
                $v->delete();
            }
            App\\Models\\PreInscripcion::where('num_iden', $dni)->delete();
            App\\Models\\Postulante::where('num_iden', $dni)->delete();
            echo 'Limpieza profunda exitosa para ' . $dni;
          `;
          const cmd = `php artisan tinker --execute="${phpCode.replace(/\n/g, ' ')}"`;
          try {
            const output = execSync(cmd, { cwd: path.join(process.cwd(), "..", "api") });
            return output.toString();
          } catch (e) {
            throw new Error(e.message);
          }
        },
        clearVouchers(voucherNumbers) {
          const phpCode = `
            $nums = ['${voucherNumbers.join("','")}'];
            App\\\\Models\\\\Voucher::whereIn('numero', $nums)->delete();
            echo 'Vouchers eliminados';
          `;
          const cmd = `php artisan tinker --execute="${phpCode.replace(/\\n/g, ' ')}"`;
          try {
            const output = execSync(cmd, { cwd: path.join(process.cwd(), "..", "api") });
            return output.toString();
          } catch (e) {
            throw new Error(e.message);
          }
        },
        ensureTestUser({ email, password, name, role }) {
          const phpCode = `
            $user = App\\Models\\User::updateOrCreate(['email' => '${email}'], [
                'name' => '${name}',
                'password' => Hash::make('${password}'),
                'estado' => 1
            ]);
            $role = App\\Models\\Role::where('slug', '${role}')->first();
            if ($role) $user->roles()->syncWithoutDetaching([$role->id]);
            echo 'Usuario configurado: ' . $email;
          `;
          const cmd = `php artisan tinker --execute="${phpCode.replace(/\n/g, '')}"`;
          try {
            const output = execSync(cmd, { cwd: path.join(process.cwd(), "..", "api") });
            return output.toString();
          } catch (e) {
            throw new Error(e.message);
          }
        },
        createPreInscripcion({ num_iden, nombres, ap_paterno, ap_materno, email, grado, programa }) {
          const phpCode = `
            try {
                $num_iden = '${num_iden}';
                $gradoName = '${grado || 'MAESTRIA PRUEBA'}';
                $progName = '${programa || 'PROGRAMA PRUEBA'}';
                
                \\App\\Models\\Voucher::where('num_iden', $num_iden)->delete();
                $grado = \\App\\Models\\Grado::firstOrCreate(['nombre' => $gradoName], ['estado' => 1]);
                $facultad = \\App\\Models\\Facultad::firstOrCreate(['nombre' => 'FICSA'], ['siglas' => 'FICSA', 'estado' => 1]);
                $concepto = \\App\\Models\\ConceptoPago::first(); 
                $concepto_id = $concepto ? $concepto->id : 1;
                $programa = \\App\\Models\\Programa::firstOrCreate(['nombre' => $progName], [
                    'grado_id' => $grado->id,
                    'facultad_id' => $facultad->id,
                    'concepto_pago_id' => $concepto_id, 
                    'estado' => 1,
                    'vacantes' => 100
                ]);
                $distrito = \\App\\Models\\Distrito::first();
                $distrito_id = $distrito ? $distrito->id : '140101';
                \\App\\Models\\PreInscripcion::updateOrCreate(['num_iden' => $num_iden], [
                    'nombres' => '${nombres}',
                    'ap_paterno' => '${ap_paterno}',
                    'ap_materno' => '${ap_materno}',
                    'tipo_doc' => 'DNI',
                    'sexo' => 'M',
                    'fecha_nacimiento' => '1990-01-01',
                    'celular' => '999888777',
                    'email' => '${email}',
                    'programa_id' => $programa->id,
                    'distrito_id' => $distrito_id,
                    'uni_procedencia' => 'Universidad Test',
                    'centro_trabajo' => 'Empresa Test',
                    'cargo' => 'Tester',
                    'estado' => 1
                ]);
                echo 'PreInscripción creada';
            } catch (\\Exception $e) {
                echo 'Error: ' . $e->getMessage();
            }
          `;
          const cmd = `php artisan tinker --execute="${phpCode.replace(/\n/g, '')}"`;
          try {
            const output = execSync(cmd, { cwd: path.join(process.cwd(), "..", "api") });
            return output.toString();
          } catch (e) {
            throw new Error(e.message);
          }
        },
        createTestInscripcion({ num_iden, nombres, ap_paterno, ap_materno, email, val_digital, val_fisica, grado, programa }) {
          // Write to a temporary file in the api directory to avoid shell quoting hell
          const phpScriptContent = `<?php
            try {
                $dni = '${num_iden}';
                $gradoName = '${grado || 'MAESTRIA PRUEBA'}';
                $progName = '${programa || 'PROGRAMA PRUEBA'}';

                $postulante = App\\Models\\Postulante::where('num_iden', $dni)->first();
                if ($postulante) {
                    App\\Models\\Inscripcion::where('postulante_id', $postulante->id)->delete();
                    App\\Models\\Documento::where('postulante_id', $postulante->id)->delete();
                }
                App\\Models\\Voucher::where('num_iden', $dni)->delete();

                $distrito = App\\Models\\Distrito::first();
                $distrito_id = $distrito ? $distrito->id : 1; 
                
                if (!$distrito) {
                     $distrito = App\\Models\\Distrito::create(['id' => '140101', 'nombre' => 'Distrito Test', 'provincia_id' => 1, 'ubigeo' => '140101']); 
                     $distrito_id = $distrito->id;
                }
                $grado = App\\Models\\Grado::firstOrCreate(['nombre' => $gradoName], ['estado' => 1]);
                $facultad = App\\Models\\Facultad::firstOrCreate(['nombre' => 'FICSA'], ['siglas' => 'FICSA', 'estado' => 1]);
                $concepto = App\\Models\\ConceptoPago::first();
                $programa = App\\Models\\Programa::firstOrCreate(['nombre' => $progName], [
                    'grado_id' => $grado->id,
                    'facultad_id' => $facultad->id,
                    'concepto_pago_id' => $concepto ? $concepto->id : 1,
                    'estado' => 1,
                    'vacantes' => 100
                ]);

                $postulante = App\\Models\\Postulante::updateOrCreate(['num_iden' => $dni], [
                    'nombres' => '${nombres}',
                    'ap_paterno' => '${ap_paterno}',
                    'ap_materno' => '${ap_materno}',
                    'email' => '${email}',
                    'tipo_doc' => 'DNI',
                    'fecha_nacimiento' => '1990-01-01',
                    'sexo' => 'M',
                    'celular' => '999888777',
                    'distrito_id' => $distrito_id,
                    'direccion' => 'Calle Test 123',
                    'estado' => 1
                ]);

                $voucher = App\\Models\\Voucher::create([
                    'num_iden' => $dni,
                    'numero' => substr($dni, 0, 7),
                    'concepto_pago_id' => $programa->concepto_pago_id,
                    'monto' => 250.00,
                    'fecha_pago' => now()->format('Y-m-d'),
                    'hora_pago' => '10:00:00',
                    'agencia' => '0987',
                    'cajero' => '0001',
                    'nombre_completo' => '${nombres} ${ap_paterno}',
                    'estado' => 0
                ]);

                $inscripcion = App\\Models\\Inscripcion::updateOrCreate(['postulante_id' => $postulante->id], [
                    'programa_id' => $programa->id,
                    'voucher_id' => $voucher->id,
                    'codigo' => substr($dni, 0, 7), 
                    'val_digital' => ${val_digital ?? 0},
                    'val_fisico' => ${val_fisica ?? 0},
                    'estado' => 1
                ]);

                // 1. Crear directorio y archivo dummy físico para la foto
                $storagePath = storage_path('app/public/fotos');
                if (!file_exists($storagePath)) {
                    mkdir($storagePath, 0755, true);
                }
                
                // Imagen dummy 1x1 pixel jpg base64
                $dummyImgInfo = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
                $dummyImgData = base64_decode($dummyImgInfo);
                file_put_contents($storagePath . '/test_foto.jpg', $dummyImgData);

                // 2. Crear registros de documentos (Excluyendo Foto)
                foreach(['DNI', 'CV', 'Constancia'] as $tipo) {
                    App\\Models\\Documento::create([
                        'postulante_id' => $postulante->id,
                        'tipo' => $tipo,
                        'nombre_archivo' => 'test_' . strtolower($tipo) . '.pdf',
                        'url' => 'http://example.com/test.pdf',
                        'estado' => 1
                    ]);
                }
                
                // Registro específico para la FOTO (JPG real)
                App\\Models\\Documento::create([
                    'postulante_id' => $postulante->id,
                    'tipo' => 'Foto',
                    'nombre_archivo' => 'fotos/test_foto.jpg', // Ruta relativa como lo espera el storage
                    'url' => 'http://localhost:8000/storage/fotos/test_foto.jpg',
                    'estado' => 1
                ]);

                echo 'Inscripción creada con éxito para ' . $dni;
            } catch (\\Exception $e) {
                echo 'Error en createTestInscripcion: ' . $e->getMessage();
            }
            `;

          const scriptPath = path.join(process.cwd(), "..", "api", "create_test_inscripcion.php");
          fs.writeFileSync(scriptPath, phpScriptContent);

          const cmd = `php artisan tinker --execute="include 'create_test_inscripcion.php';"`;
          try {
            const output = execSync(cmd, { cwd: path.join(process.cwd(), "..", "api") });
            return output.toString();
          } catch (e) {
            throw new Error(e.message);
          }
        },
        createTestDocente({ dni, nombres, ap_paterno, ap_materno, email }) {
          const scriptName = `create_docente_${Date.now()}.php`;
          const scriptPath = path.join(process.cwd(), "..", "api", scriptName);
          const phpCode = `<?php
              try {
                  $d = \\App\\Models\\Docente::updateOrCreate(['dni' => '${dni}'], [
                      'nombres' => '${nombres}',
                      'ap_paterno' => '${ap_paterno}',
                      'ap_materno' => '${ap_materno}',
                      'email' => '${email}',
                      'password' => \\Illuminate\\Support\\Facades\\Hash::make('12345678'),
                      'estado' => 1
                  ]);
                  echo 'DOCENTE_CREATED_SUCCESS';
              } catch (\\Exception $e) {
                  echo 'ERROR: ' . $e->getMessage();
              }
            `;

          fs.writeFileSync(scriptPath, phpCode);
          const cmd = `php artisan tinker --execute="include '${scriptName}';"`;
          try {
            const output = execSync(cmd, { cwd: path.join(process.cwd(), "..", "api") });
            if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
            return output.toString();
          } catch (e) {
            if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
            throw new Error(e.message);
          }
        },
        runTinker(phpCode) {
          const scriptName = `tinker_script_${Date.now()}.php`;
          const scriptPath = path.join(process.cwd(), "..", "api", scriptName);
          const fullPhpCode = `<?php\n${phpCode}`;

          fs.writeFileSync(scriptPath, fullPhpCode);

          const cmd = `php artisan tinker --execute="include '${scriptName}';"`;
          try {
            const output = execSync(cmd, { cwd: path.join(process.cwd(), "..", "api") });
            // Clean up
            fs.unlinkSync(scriptPath);
            return output.toString();
          } catch (e) {
            // Clean up even on error
            if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
            throw new Error(e.message);
          }
        },
        clearDownloads() {
          const downloadsPath = path.join(process.cwd(), "cypress", "downloads");
          if (fs.existsSync(downloadsPath)) {
            const files = fs.readdirSync(downloadsPath);
            for (const file of files) {
              try {
                fs.unlinkSync(path.join(downloadsPath, file));
              } catch (e) { /* ignore */ }
            }
          }
          return null;
        },
        listFiles(folderName) {
          const folderPath = path.resolve(folderName);
          return fs.existsSync(folderPath) ? fs.readdirSync(folderPath) : [];
        }
      });

      return config;
    },

    // ✅ Indica que usarás archivos .feature y .cy.js
    specPattern: [
      "cypress/e2e/**/*.feature",
      "cypress/e2e/**/*.cy.{js,ts}",
    ],

    // ✅ Dile a cucumber dónde buscar los steps
    cucumber: {
      stepDefinitions: [
        "cypress/e2e/**/*.{steps.js,steps.ts}",
        "cypress/support/step_definitions/**/*.{js,ts,steps.js,steps.ts}"
      ],
    },

    supportFile: "cypress/support/e2e.js",
    screenshotsFolder: "cypress/evidencias/screenshots",
    videosFolder: "cypress/evidencias/videos",
    video: true,
    screenshotOnRunFailure: true,
    viewportHeight: 1080,
    viewportWidth: 1920,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
