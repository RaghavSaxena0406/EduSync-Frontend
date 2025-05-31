import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from '../../utils/axiosConfig';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/AssessmentResults/analytics');
        const data = response.data;
        
        setChartData({
          labels: data.map(item => item.assessmentTitle || 'Assessment'),
          datasets: [{
            label: 'Average Score',
            data: data.map(item => item.averageScore),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          }]
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Assessment Performance Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Average Score (%)'
        }
      }
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Assessment Analytics</h2>
      {chartData.labels.length === 0 ? (
        <div className="alert alert-info">
          <h4>No data available</h4>
          <p>There are no assessment results to display yet.</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
