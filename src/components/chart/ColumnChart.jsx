import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ColumnChart = ({data, options})=>{
    return <Bar data={data} options={options} />
}

ColumnChart.propTypes  = {
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
};

export default ColumnChart;