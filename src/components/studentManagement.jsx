import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from "../redux/api/studentSlice";

const StudentManagement = () => {
  const { data: students = [], isFetching, refetch } = useGetStudentsQuery();
  const [addStudent] = useAddStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [session, setSession] = useState("");
  const [teacher, setTeacher] = useState("");
  const [department, setDepartment] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch the students when the component mounts or when mutations happen
  useEffect(() => {
    refetch();
  }, [addStudent, updateStudent, deleteStudent, students.length]); // Re-run the effect when students data changes

  const handleAddOrUpdateStudent = async () => {
    if (
      !name ||
      !rollNo ||
      !subject ||
      !section ||
      !session ||
      !teacher ||
      !department
    ) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "error",
      });
      return;
    }

    const studentData = {
      name,
      rollNo,
      subject,
      section,
      session,
      teacher,
      department,
    };

    try {
      if (studentId) {
        // Update student
        await updateStudent({ id: studentId, studentData }).unwrap();
        setSnackbar({
          open: true,
          message: "Student updated successfully",
          severity: "success",
        });
      } else {
        // Add student
        await addStudent(studentData).unwrap();
        setSnackbar({
          open: true,
          message: "Student added successfully",
          severity: "success",
        });
      }
      resetForm();
      setIsDialogOpen(false);
      refetch(); // Refetch to ensure the updated data is reflected
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.data?.message || error.message}`,
        severity: "error",
      });
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id).unwrap();
      setSnackbar({
        open: true,
        message: "Student deleted successfully",
        severity: "success",
      });
      refetch(); // Refetch to remove the deleted student from UI
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.data?.message || error.message}`,
        severity: "error",
      });
    }
  };

  const resetForm = () => {
    setName("");
    setRollNo("");
    setSubject("");
    setSection("");
    setSession("");
    setTeacher("");
    setDepartment("");
    setStudentId(null);
  };

  const handleEdit = (student) => {
    setStudentId(student._id);
    setName(student.name);
    setRollNo(student.rollNo);
    setSubject(student.subject);
    setSection(student.section);
    setSession(student.session);
    setTeacher(student.teacher);
    setDepartment(student.department);
    setIsDialogOpen(true);
  };

  return (
    <Box p={3} maxWidth="1200px" mx="auto">
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        fontWeight="bold"
        color="#37474f"
      >
        Student Management
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsDialogOpen(true)}
          style={{
            background: "linear-gradient(90deg, #42a5f5, #1e88e5)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Add Student
        </Button>
      </Box>

      <Grid container spacing={3}>
        {isFetching ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
              width: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : students.length > 0 ? (
          students.map((student) => (
            <Grid item xs={12} sm={6} md={4} key={student._id}>
              <Card
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  width: "300px",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <CardContent sx={{ padding: "1rem" }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: "#2196F3" }}
                  >
                    {student.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Roll No: {student.rollNo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subject: {student.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Section: {student.section}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Session: {student.session}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Teacher: {student.teacher}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    department: {student.department}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ justifyContent: "space-between", padding: "0.5rem" }}
                >
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleEdit(student)}
                      sx={{
                        backgroundColor: "#81d4fa",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#4fc3f7",
                        },
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => handleDeleteStudent(student._id)}
                      sx={{
                        backgroundColor: "#ff8a80",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#ff5252",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary" align="center">
            No students to display
          </Typography>
        )}
      </Grid>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {studentId ? "Update Student" : "Add Student"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Roll No."
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Teacher"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddOrUpdateStudent}
            style={{
              background: "linear-gradient(90deg, #42a5f5, #1e88e5)",
              color: "white",
            }}
          >
            {studentId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentManagement;
