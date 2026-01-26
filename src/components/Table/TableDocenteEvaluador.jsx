import { Select } from "@nextui-org/react";

const MultiSelectExample = ({ defaultItems, selectedKeys, onSelectionChange }) => {
    const handleChange = (e) => {
        // e.target.value será un array con las claves seleccionadas
        onSelectionChange(e.target.value);
    };

    return (
        <Select
            label="Selecciona Programas"
            multiple
            value={selectedKeys}
            onChange={handleChange}
        >
            {defaultItems.map((item) => (
                <Select.Item key={item.key} value={item.key}>
                    {item.textValue}
                </Select.Item>
            ))}
        </Select>
    );
};

export default MultiSelectExample;
