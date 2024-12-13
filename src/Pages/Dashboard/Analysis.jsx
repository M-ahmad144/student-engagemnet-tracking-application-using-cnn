import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Container,
  Paper,
  CircularProgress,
  Grid,
  Slider,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { useMediaQuery } from "@mui/material";

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  width: "100%",
  maxWidth: "100% !important",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4),
  backgroundColor: "#ffffff",
  marginLeft: "60px",
  overflow: "hidden",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
}));

const ChartPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  height: "100%",
}));

const Analysis = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 100]);
  const videoName = useSelector((state) => state.video.videoName);

  // Detect mobile screens
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchAnalysisResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/analysis-result?video_name=${videoName}`
        );
        setResults(response.data.engagement_results);
      } catch (error) {
        console.error("Error fetching analysis results:", error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisResults();
  }, [videoName]);

  const prepareChartData = () => {
    if (!results)
      return {
        summaryData: [],
        timelineData: [],
        pieData: [],
        heatmapData: [],
        scatterData: [],
      };

    const engagementCounts = {
      Engaged: results.filter((r) => r.engagement_status === "Engaged").length,
      Distracted: results.filter((r) => r.engagement_status === "Distracted")
        .length,
      Neutral: results.filter((r) => r.engagement_status === "Neutral").length,
    };

    const total = Object.values(engagementCounts).reduce((a, b) => a + b, 0);

    const summaryData = Object.entries(engagementCounts).map(
      ([key, value]) => ({
        status: key,
        count: value,
        percentage: ((value / total) * 100).toFixed(2),
      })
    );

    const timelineData = results.map((r, i) => ({
      frame: i + 1,
      status: r.engagement_status,
      engagementValue:
        r.engagement_status === "Engaged"
          ? 2
          : r.engagement_status === "Neutral"
          ? 1
          : 0,
    }));

    const pieData = summaryData.map((item) => ({
      name: item.status,
      value: parseFloat(item.percentage),
    }));

    const heatmapData = [
      {
        id: "Engagement Intensity",
        data: timelineData.map((d) => ({
          x: d.frame,
          y: d.engagementValue,
        })),
      },
    ];

    const scatterData = timelineData.map((d) => ({
      x: d.frame,
      y: d.engagementValue,
      z: 1,
    }));

    return { summaryData, timelineData, pieData, heatmapData, scatterData };
  };

  const { summaryData, timelineData, pieData, heatmapData, scatterData } =
    prepareChartData();

  const COLORS = ["#4caf50", "#f44336", "#ffc107"];

  const handleTimeRangeChange = (event, newValue) => {
    setTimeRange(newValue);
  };

  const filteredTimelineData = timelineData.slice(timeRange[0], timeRange[1]);

  if (loading) {
    return (
      <StyledContainer>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress size={60} />
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem" }, mb: 4 }}
        align="center"
      >
        Advanced Engagement Analysis for{" "}
        <span style={{ color: "#1976d2" }}>{videoName}</span>
      </Typography>

      {results ? (
        <Grid container spacing={4}>
          {/* Engagement Overview */}
          <Grid item xs={12} md={6}>
            <ChartPaper>
              <Typography variant="h5" gutterBottom>
                <strong>Engagement Overview:</strong> Summary of Student
                Engagement
              </Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                <BarChart data={summaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="count"
                    fill="#8884d8"
                    name="Count"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="percentage"
                    fill="#82ca9d"
                    name="Percentage"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartPaper>
          </Grid>

          {/* Engagement Distribution */}
          <Grid item xs={12} md={6}>
            <ChartPaper>
              <Typography variant="h5" gutterBottom>
                Engagement Distribution by Status
              </Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartPaper>
          </Grid>

          {/* Engagement Timeline */}
          <Grid item xs={12}>
            <ChartPaper>
              <Typography variant="h5" gutterBottom>
                Engagement Timeline: Tracking Attention Over Time
              </Typography>
              <Slider
                value={timeRange}
                onChange={handleTimeRangeChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                max={timelineData.length}
                sx={{ width: "100%", maxWidth: "600px", margin: "auto" }}
              />
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                <LineChart data={filteredTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frame" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="stepAfter"
                    dataKey="engagementValue"
                    stroke="#8884d8"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartPaper>
          </Grid>

          {/* Engagement Heatmap */}
          <Grid item xs={12}>
            <ChartPaper>
              <Typography variant="h5" gutterBottom>
                Engagement Heatmap: Visualizing Engagement Intensity by Frame
              </Typography>
              <div style={{ height: isMobile ? "300px" : "400px" }}>
                <ResponsiveHeatMap
                  data={heatmapData}
                  margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                  xOuterPadding={0.1}
                  yOuterPadding={0.1}
                  axisTop={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -90,
                    legend: "",
                    legendPosition: "middle",
                    legendOffset: -46,
                  }}
                  axisRight={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Engagement Level",
                    legendPosition: "middle",
                    legendOffset: 70,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Engagement Level",
                    legendPosition: "middle",
                    legendOffset: -72,
                  }}
                  colors={{
                    type: "sequential",
                    scheme: "blues",
                  }}
                  emptyColor="#555555"
                  legends={[
                    {
                      anchor: "bottom",
                      translateX: 0,
                      translateY: 30,
                      length: 400,
                      thickness: 8,
                      direction: "row",
                      tickPosition: "after",
                      tickSize: 3,
                      tickSpacing: 4,
                      tickOverlap: false,
                      tickFormat: ">-.2s",
                      title: "Engagement Intensity →",
                      titleAlign: "start",
                      titleOffset: 4,
                    },
                  ]}
                />
              </div>
            </ChartPaper>
          </Grid>

          {/* Engagement Scatter Plot */}
          <Grid item xs={12}>
            <ChartPaper>
              <Typography variant="h5" gutterBottom>
                Engagement Scatter Plot: Individual Data Point Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Frame" />
                  <YAxis type="number" dataKey="y" name="Engagement Level" />
                  <ZAxis
                    type="number"
                    dataKey="z"
                    range={[0, 500]}
                    name="Value"
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter
                    name="Engagement"
                    data={scatterData}
                    fill="#8884d8"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartPaper>
          </Grid>
        </Grid>
      ) : (
        <Typography sx={{ textAlign: "center", color: "#666666" }}>
          No engagement data available for analysis.
        </Typography>
      )}
    </StyledContainer>
  );
};

export default Analysis;
