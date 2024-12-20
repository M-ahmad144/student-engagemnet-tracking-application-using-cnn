import React, { useState, useEffect } from "react"; // Ensure useEffect is imported
import {
  Button,
  Box,
  Typography,
  Container,
  CircularProgress,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setVideoData } from "../../redux/features/video/videoSlice";
import { useSaveEngagementResultMutation } from "../../redux/api/studentSlice";

const StyledContainer = styled(Container)(({ theme }) => ({
  height: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 !important",
  margin: 0,
  backgroundColor: "#f0f2f5",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  borderRadius: 0,
  boxShadow: "none",
  backgroundColor: "#f0f2f5",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 600,
  textAlign: "center",
  padding: theme.spacing(4),
}));

const UploadButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: 30,
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1.1rem",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  marginTop: theme.spacing(4),
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
}));

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login"); // Navigate if user is already logged in
    }
  }, [userInfo, navigate]);

  if (!userInfo) {
    return (
      <StyledContainer>
        <CircularProgress />
      </StyledContainer>
    );
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setSelectedFile(file);
      setLoading(true);
      const formData = new FormData();
      formData.append("video", file);

      try {
        const response = await axios.post(
          "http://localhost:5000/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // Save response in Redux store
        const videoName = response.data.video_name;
        const videoDetails = response.data; // Store other details if needed
        dispatch(setVideoData({ videoName, videoDetails }));

        navigate(`/analysis-result?video_name=${videoName}`);
      } catch (error) {
        console.error("Error uploading video:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <StyledContainer maxWidth={false}>
      <StyledPaper elevation={0}>
        <ContentBox>
          <Typography
            variant="h3"
            color="primary"
            gutterBottom
            fontWeight={700}
            sx={{
              fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
            }}
          >
            Student Engagement Tracking
          </Typography>

          <Typography
            variant="h6"
            color="textSecondary"
            sx={{
              mb: 3,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            Upload a video to analyze student engagement
          </Typography>

          <UploadButton
            component="label"
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
            sx={{
              width: { xs: "100%", sm: "auto" },
              maxWidth: 300,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : selectedFile ? (
              "Change Video"
            ) : (
              "Upload Video"
            )}
            <input
              type="file"
              hidden
              accept="video/*"
              onChange={handleFileUpload}
            />
          </UploadButton>

          {selectedFile && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Selected: {selectedFile.name}
            </Typography>
          )}
        </ContentBox>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Home;
