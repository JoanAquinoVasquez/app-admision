import { Button } from "@heroui/react";

export default function TestButton() {
    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Test de Botones HeroUI</h2>

            {/* Botones con diferentes variantes */}
            <div className="flex gap-4 flex-wrap">
                <Button color="primary">Primary Default</Button>
                <Button color="primary" variant="solid">Primary Solid</Button>
                <Button color="primary" variant="bordered">Primary Bordered</Button>
                <Button color="primary" variant="light">Primary Light</Button>
                <Button color="primary" variant="flat">Primary Flat</Button>
                <Button color="primary" variant="faded">Primary Faded</Button>
                <Button color="primary" variant="shadow">Primary Shadow</Button>
                <Button color="primary" variant="ghost">Primary Ghost</Button>
            </div>

            {/* Botones con diferentes colores */}
            <div className="flex gap-4 flex-wrap">
                <Button color="default">Default</Button>
                <Button color="primary">Primary</Button>
                <Button color="secondary">Secondary</Button>
                <Button color="success">Success</Button>
                <Button color="warning">Warning</Button>
                <Button color="danger">Danger</Button>
            </div>

            {/* Botón con className personalizado */}
            <div className="flex gap-4">
                <Button className="bg-blue-500 text-white">Custom Blue</Button>
                <Button style={{ backgroundColor: '#006FEE', color: 'white' }}>Inline Style</Button>
            </div>
        </div>
    );
}
