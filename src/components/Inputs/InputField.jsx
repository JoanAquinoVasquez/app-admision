import { Input } from "@nextui-org/react";
import PropTypes from "prop-types";
import React, { useState, useMemo } from "react";

const ReusableInput = ({
    label,
    name,
    type,
    className = "",
    isRequired = true,
    onChange,
    value,
    optiondisable,
    onlyNumbers = false,
    onlyLetters = false,
    maxLength,
    minLength,
    minAge = 18,
    maxAge = 100,
    isAgeField = false,
    autocomplete, // Add autocomplete prop
    uppercase = false, // <- NUEVO
    size = "sm", // Default to small
}) => {
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        let inputValue = e.target.value;

        if (onlyNumbers && !/^\d*$/.test(inputValue)) {
            return;
        }
        if (onlyLetters && !/^[a-zA-Z\s]*$/.test(inputValue)) {
            return;
        }

        // Forzar a mayúsculas si la prop lo indica
        if (uppercase) {
            inputValue = inputValue.toUpperCase();
        }

        const simulatedEvent = {
            target: {
                name: name,
                value: inputValue,
            },
        };

        onChange && onChange(simulatedEvent);
    };

    const validateAge = (dob) => {
        if (!dob) return;

        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth();

        if (
            month < birthDate.getMonth() ||
            (month === birthDate.getMonth() &&
                today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        if (isAgeField) {
            if (age < minAge) {
                setError(`Debes tener al menos ${minAge} años.`);
            } else if (age > maxAge) {
                setError(`La edad no puede ser mayor a ${maxAge} años.`);
            } else {
                setError("");
            }
        }
    };

    const isEmailInvalid = type === "email" && value && !value.includes("@");

    // Set default autocomplete values based on input type
    const getAutoCompleteValue = () => {
        switch (type) {
            case "email":
                return "email";
            case "name":
                return "name";
            case "tel":
                return "tel";
            case "date":
                return "bday";
            case "password":
                return "new-password";
            default:
                return autocomplete || "off"; // Default to "off" if not specified
        }
    };

    return (
        <>
            <Input
                isRequired={isRequired}
                disabled={optiondisable}
                name={name}
                type={type}
                size={size}
                label={label}
                color={isEmailInvalid ? "danger" : "default"}
                className={className}
                style={{ paddingBottom: 0, paddingLeft: 0 }}
                clearable={!optiondisable} // Solo permite borrar si no está deshabilitado
                onClear={
                    !optiondisable
                        ? () => {
                            const event = {
                                target: {
                                    name: name,
                                    value: "",
                                },
                            };
                            onChange && onChange(event);
                        }
                        : undefined
                }
                onChange={(e) => {
                    handleInputChange(e);
                    if (type === "date") validateAge(e.target.value);
                }}
                value={value}
                maxLength={maxLength}
                minLength={minLength}
                autoComplete={getAutoCompleteValue()} // Dynamically assign autocomplete attribute
            />
            {error && (
                <div style={{ color: "red", marginTop: "5px" }}>{error}</div>
            )}
        </>
    );
};

ReusableInput.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    className: PropTypes.string,
    isRequired: PropTypes.bool,
    onChange: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string,
    optiondisable: PropTypes.bool,
    onlyNumbers: PropTypes.bool,
    onlyLetters: PropTypes.bool,
    maxLength: PropTypes.number,
    minLength: PropTypes.number,
    minAge: PropTypes.number,
    maxAge: PropTypes.number,
    isAgeField: PropTypes.bool,
    autocomplete: PropTypes.string, // Add autocomplete prop validation
    uppercase: PropTypes.bool,
};

export default React.memo(ReusableInput);
