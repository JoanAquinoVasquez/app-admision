import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import PropTypes from "prop-types";

function DynamicLineChart({ data, lines }) {
    return (
        <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
                formatter={(value) =>
                    `$${new Intl.NumberFormat("us").format(value)}`
                }
            />
            <Legend />
            {lines.map((line, index) => (
                <Line
                    key={index}
                    type="monotone"
                    dataKey={line.dataKey}
                    stroke={line.color}
                    activeDot={{ r: 8 }}
                />
            ))}
        </LineChart>
    );
}
DynamicLineChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    lines: PropTypes.arrayOf(
        PropTypes.shape({
            dataKey: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default DynamicLineChart;
