import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Container,
  Paper,
  CircularProgress,
  Grid,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";
import { useSaveEngagementResultMutation } from "../../redux/api/studentSlice";

// Styled components for better UI
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4),
  overflow: "hidden",
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const videoName = useSelector((state) => state.video.videoName);
  const [saveEngagementResult, { isLoading: isSaving }] =
    useSaveEngagementResultMutation();

  useEffect(() => {
    const fetchAnalysisResults = async () => {
      if (!videoName) return; // Early exit if videoName is not available.
      try {
        const response = await axios.get(
          `http://localhost:5000/analysis-result?video_name=${videoName}`
        );
        setResults(response.data.engagement_results);
        console.log(response.data.engagement_results);
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
        scatterData: [],
        areaData: [],
      };

    const engagementCounts = {
      Engaged: results.filter((r) => r.engagement_status === "Engaged").length, //get count of engaged frames
      Distracted: results.filter((r) => r.engagement_status === "Distracted") //get count of distracted frames
        .length,
    };

    const total = Object.values(engagementCounts).reduce((a, b) => a + b, 0); //get total count of engaged and distracted

    const summaryData = Object.entries(engagementCounts).map(
      ([key, value]) => ({
        status: key,
        count: value,
        percentage: ((value / total) * 100).toFixed(2),
      })
    );

    const timelineData = results.map((r, i) => ({
      frame: i + 1,
      engaged: r.engagement_status === "Engaged" ? 1 : 0,
      distracted: r.engagement_status === "Distracted" ? 1 : 0,
    }));

    const pieData = summaryData.map((item) => ({
      name: item.status,
      value: parseFloat(item.percentage),
    }));

    const scatterData = results.map((r, i) => ({
      frame: i + 1,
      engagementLevel: r.engagement_status === "Engaged" ? 1 : 0,
      distractionLevel: r.engagement_status === "Distracted" ? 1 : 0,
    }));

    const areaData = results.map((r, i) => ({
      frame: i + 1,
      engaged: r.engagement_status === "Engaged" ? 1 : 0,
      distracted: r.engagement_status === "Distracted" ? 1 : 0,
    }));

    return { summaryData, timelineData, pieData, scatterData, areaData };
  };
  const handleSaveResult = async () => {
    if (!results || results.length === 0) {
      setSnackbarMessage("No results available to save.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    // Calculate the engagement percentage (based on "Engaged" status)
    const engagementCounts = {
      Engaged: results.filter((r) => r.engagement_status === "Engaged").length,
      Distracted: results.filter((r) => r.engagement_status === "Distracted")
        .length,
    };

    const total = Object.values(engagementCounts).reduce((a, b) => a + b, 0);
    const engagementPercentage = (engagementCounts.Engaged / total) * 100;

    // Set engagement category based on the engagement percentage
    let engagementCategory = "";
    if (engagementPercentage <= 20) {
      engagementCategory = "Very Low Engagement";
    } else if (engagementPercentage <= 40) {
      engagementCategory = "Low Engagement";
    } else if (engagementPercentage <= 60) {
      engagementCategory = "Moderate Engagement";
    } else if (engagementPercentage <= 80) {
      engagementCategory = "High Engagement";
    } else {
      engagementCategory = "Very High Engagement";
    }

    // Set final engagement status based on percentage
    const finalEngagementStatus =
      engagementPercentage > 50 ? "Engaged" : "Distracted";

    // Extract roll number from videoName (e.g., "144.mp4" => "144")
    const rollNo = videoName.split(".")[0];

    console.log(
      `Saving engagement result for video: ${videoName} with status: ${finalEngagementStatus}, category: ${engagementCategory}, and engagement percentage: ${engagementPercentage}`
    );

    try {
      // Send the data to the backend with all required fields
      await saveEngagementResult({
        rollNo,
        finalEngagementStatus,
        engagementCategory,
        engagementPercentage: parseFloat(engagementPercentage.toFixed(2)),
      }).unwrap();

      // Success Snackbar
      setSnackbarMessage(`Engagement result for ${rollNo} saved successfully!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving engagement result:", error);
      setSnackbarMessage("Failed to save engagement result.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const { summaryData, timelineData, pieData, scatterData, areaData } =
    prepareChartData();

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
      <Box mb={4} display="flex" justifyContent="space-between">
        <Typography variant="h4">
          Engagement Analysis for {videoName}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveResult}
          disabled={!results || isSaving}
        >
          {isSaving
            ? "Saving..."
            : results
            ? "Save Engagement Result"
            : "No Data to Save"}
        </Button>
      </Box>

      {results ? (
        <Grid container spacing={4}>
          {/* Row 1: Engagement Distribution and Engagement Over Time */}
          <Grid item xs={12} md={6}>
            <ChartPaper>
              <Typography variant="h6" gutterBottom>
                Engagement Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#4caf50" : "#f44336"} // Green and Red
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <ChartPaper>
              <Typography variant="h6" gutterBottom>
                Engagement Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frame" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="engaged"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="distracted"
                    stroke="#f44336"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartPaper>
          </Grid>

          {/* Row 2: Engagement by Frame (Stacked) and Engagement Heatmap */}
          <Grid item xs={12} md={6}>
            <ChartPaper>
              <Typography variant="h6" gutterBottom>
                Engagement by Frame (Stacked)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frame" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engaged" stackId="a" fill="#4caf50" />
                  <Bar dataKey="distracted" stackId="a" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            </ChartPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <ChartPaper>
              <Typography variant="h6" gutterBottom>
                Engagement Heatmap
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis dataKey="frame" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Scatter data={scatterData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartPaper>
          </Grid>

          {/* Row 3: Engagement Trend Analysis */}
          <Grid item xs={12}>
            <ChartPaper>
              <Typography variant="h6" gutterBottom>
                Engagement Trend Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={areaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frame" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="engaged"
                    stackId="1"
                    stroke="#4caf50"
                    fill="#4caf50"
                  />
                  <Area
                    type="monotone"
                    dataKey="distracted"
                    stackId="1"
                    stroke="#f44336"
                    fill="#f44336"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartPaper>
          </Grid>
        </Grid>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="70vh"
        >
          <Typography variant="h6" color="textSecondary">
            No student data to display
          </Typography>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default Analysis;
