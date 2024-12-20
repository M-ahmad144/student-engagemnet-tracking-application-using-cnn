import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import SubjectIcon from "@mui/icons-material/Subject";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import {
  useGetStudentsQuery,
  useDisplayEngagementResultQuery,
} from "../redux/api/studentSlice";

const StudentEngagementResults = () => {
  const [filters, setFilters] = useState({
    department: "",
    section: "",
    session: "",
  });

  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [fetchTriggered, setFetchTriggered] = useState(false);

  const { data: studentsData, isLoading: isLoadingStudents } =
    useGetStudentsQuery();

  useEffect(() => {
    if (studentsData) {
      const uniqueDepartments = [
        ...new Set(
          studentsData.map((student) => student.department).filter(Boolean)
        ),
      ];
      const uniqueSections = [
        ...new Set(
          studentsData.map((student) => student.section).filter(Boolean)
        ),
      ];
      const uniqueSessions = [
        ...new Set(
          studentsData.map((student) => student.session).filter(Boolean)
        ),
      ];

      setDepartments(uniqueDepartments);
      setSections(uniqueSections);
      setSessions(uniqueSessions);
    }
  }, [studentsData]);

  const {
    data: results,
    isLoading,
    isError,
  } = useDisplayEngagementResultQuery(filters, {
    skip: !fetchTriggered,
  });

  useEffect(() => {
    if (fetchTriggered) return;
    setFetchTriggered(true);
  }, []);

  useEffect(() => {
    if (fetchTriggered) {
      setFetchTriggered(false);
      setFetchTriggered(true);
    }
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleResetFilters = () => {
    setFilters({
      department: "",
      section: "",
      session: "",
    });
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: "#3f51b5", fontWeight: "bold" }}
      >
        Student Engagement Results
      </Typography>

      {/* Filters Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginLeft: "40px", // Adjusted margin for the filter section
        }}
      >
        <Grid container spacing={2}>
          {/* Department Filter */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                disabled={isLoadingStudents || isLoading}
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "4px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {departments.map((dept, idx) => (
                  <MenuItem key={dept || idx} value={dept}>
                    {dept || "Unknown Department"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Section Filter */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Section</InputLabel>
              <Select
                name="section"
                value={filters.section}
                onChange={handleFilterChange}
                disabled={isLoadingStudents || isLoading}
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "4px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {sections.map((sec, idx) => (
                  <MenuItem key={sec || idx} value={sec}>
                    {sec || "Unknown Section"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Session Filter */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Session</InputLabel>
              <Select
                name="session"
                value={filters.session}
                onChange={handleFilterChange}
                disabled={isLoadingStudents || isLoading}
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "4px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {sessions.map((session, idx) => (
                  <MenuItem key={session || idx} value={session}>
                    {session || "Unknown Session"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box mt={3} textAlign="center">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleResetFilters}
            size="small"
            disabled={isLoading}
            sx={{
              borderRadius: "20px",
              padding: "8px 24px",
              borderColor: "#3f51b5",
              color: "#3f51b5",
              "&:hover": { backgroundColor: "#3f51b5", color: "#ffffff" },
            }}
          >
            Reset Filters
          </Button>
        </Box>
      </Paper>

      {/* Results Section */}
      {isLoading && fetchTriggered ? (
        <Box textAlign="center">
          <CircularProgress size={50} sx={{ color: "#3f51b5" }} />
        </Box>
      ) : isError && fetchTriggered ? (
        <Typography
          textAlign="center"
          variant="h6"
          color="error"
          sx={{ fontWeight: "bold" }}
        >
          No results found
        </Typography>
      ) : fetchTriggered && results?.length ? (
        <TableContainer
          component={Paper}
          sx={{
            margin: "0 auto",
            width: "90%",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                  <PeopleIcon sx={{ fontSize: 20, marginRight: 1 }} /> Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                  <GroupIcon sx={{ fontSize: 20, marginRight: 1 }} /> Roll
                  Number
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                  <SubjectIcon sx={{ fontSize: 20, marginRight: 1 }} /> Subject
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                  <SchoolIcon sx={{ fontSize: 20, marginRight: 1 }} /> Section
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                  <SchoolIcon sx={{ fontSize: 20, marginRight: 1 }} /> Session
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                  Department
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                  <BarChartIcon sx={{ fontSize: 20, marginRight: 1 }} />{" "}
                  Engagement Results
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((student) => (
                <TableRow key={student.rollNo}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.subject}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.session}</TableCell>
                  <TableCell>{student.department || "N/A"}</TableCell>
                  <TableCell>
                    {student.results.length > 0
                      ? student.results.map((result, idx) => (
                          <Box
                            key={idx}
                            mb={2}
                            sx={{
                              borderBottom: "1px solid #ccc",
                              padding: "8px",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ display: "block", color: "#3f51b5" }}
                            >
                              <strong>Category:</strong>{" "}
                              {result.engagementCategory}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ display: "block" }}
                            >
                              <strong>Status:</strong>{" "}
                              {result.finalEngagementStatus}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ display: "block" }}
                            >
                              <strong>Percentage:</strong>{" "}
                              {result.engagementPercentage}%
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ display: "block" }}
                            >
                              <strong>Date:</strong>{" "}
                              {new Date(result.dateTime).toLocaleDateString()}
                            </Typography>
                          </Box>
                        ))
                      : "No results available"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : fetchTriggered ? (
        <Typography textAlign="center" variant="h6">
          No results found.
        </Typography>
      ) : null}
    </Box>
  );
};

export default StudentEngagementResults;
