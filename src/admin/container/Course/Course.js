import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Course() {
    const [data, setData] = useState([]);
    const [edit, setEdit] = useState(null);
    const [open, setOpen] = useState(false);

    const getData = async () => {
        try {
            const response = await fetch("http://localhost:8001/api/v1/courses/list-course");
            const result = await response.json();
            console.log(result.data);
            setData(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const courseSchema = yup.object({
        name: yup.string().required("Course name is required").matches(/^[a-zA-Z'-\s]*$/, 'Invalid name'),
        description: yup.string().required("Description is required").min(10, "Must be at least 10 characters"),
    });

    const handleAdd = async (data) => {
        console.log(data);
        try {
            await fetch("http://localhost:8001/api/v1/courses/add-course", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.log(error);
        }
        getData();
    };

    const handleDelete = async (id) => {
        console.log(id);
        try {
            await fetch(`http://localhost:8001/api/v1/courses/delete-course/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting data:', error);
        }
        getData();
    };

    const handleEdit = (data) => {
        formik.setValues(data);
        setEdit(data);
        handleClickOpen();
    };

    const handleUpdate = async (data) => {
        console.log(data);
        try {
            await fetch(`http://localhost:8001/api/v1/courses/update-course/${data._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.log(error);
        }
        getData();
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema: courseSchema,
        onSubmit: (values, { resetForm }) => {
            if (edit) {
                handleUpdate(values);
            } else {
                handleAdd(values);
            }
            resetForm();
            handleClose();
        }
    });

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEdit(null);
        formik.resetForm();
    };

    const columns = [
        {
            field: 'name',
            headerName: 'Course Name',
            width: 130
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 130
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(params.row._id)}
                    startIcon={<DeleteIcon />}
                >
                </Button>
            ),
        },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(params.row)}
                    startIcon={<EditIcon />}
                >
                </Button>
            ),
        }
    ];

    return (
        <>
            <div>
                <h1>Course Page</h1>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Add Course
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <form onSubmit={handleSubmit}>
                        <DialogTitle>Course</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                id="name"
                                name="name"
                                label="Course Name"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                            />
                            <TextField
                                margin="dense"
                                id="description"
                                name="description"
                                label="Description"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">{edit ? "Update" : "Add"}</Button>
                        </DialogActions>
                    </form>
                </Dialog>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        getRowId={(row) => row._id}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                    />
                </div>
            </div>
        </>
    );
}

export default Course;
