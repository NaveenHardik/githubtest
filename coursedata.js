import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Container, Button, Form, Table, Modal, FormControl, InputGroup } from 'react-bootstrap';
import styles from './coursedata.css';
import './common.css';
import { FaPencilAlt, FaTrashAlt, FaEye, FaPlus, FaSearch } from "react-icons/fa";
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CourseData = (props) => {

  const [search, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  const [editshow, setEditShow] = useState(false);
  const [courseTable, setcourseTable] = useState({
    id: '',
    courseName: '',
    courseFess: '',
    courseDuration: '',

  });
  const [courseList, setCourseList] = useState([]);
  const [editcourseList, setEditCourseList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editChange, setEditChange] = useState({});
  const handleClose = () => setShow(false);
  const handleEditClose = () => setEditShow(false);
  const handleShow = () => setShow(true);
  const handleEditShow = () => setEditShow(true);



  const options = {

    autoClose: 2000,
    draggable: true,
    hideProgressBar: false,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    closeOnClick: true
  };

  let i = 1;
  function sno() { return i++; }

  useEffect(() => {
    Axios.get("/course-data", {
    }).then((response) => {
      let result = response.data.recordset;
      setCourseList(result);
    });
  }, [refreshKey]);

  const handleMasterChange = (e) => setcourseTable({
    ...courseTable,
    [e.target.name]: [e.target.value],
  });

  const handleSubmit = (e) => {
    if ((courseTable.courseName != "") && (courseTable.courseFess != "") && (courseTable.courseDuration != "")) {
      e.preventDefault();
      Axios.post("/course-data",
        {
          courseName: courseTable.courseName,
          courseFess: courseTable.courseFees,
          courseDuration: courseTable.courseDuration
        })
        .then(
          (response) => {
            if (response.data.status == true) {
              handleClose();
              setRefreshKey(oldKey => oldKey + 1);
              toast.success(`New course ${courseTable.courseName} added.`, options);
            }
            else if (response.data.status == false) {
              handleClose();
              toast.info(`${response.data.message}`, options);
            }
          });
    }
    else {
      toast.info("Empty value are not valid please Enter Valid  Details only");
    }

  };

  const handleEditValue = (event) => setEditChange({
    ...editChange,
    [event.target.name]: [event.target.value],
  });

  const handleEditSubmit = () => {
    if (editChange.courseFees != "") {
      const id = editcourseList.id;
      Axios.patch(`/course-data/${id}`,
        { id: id, newcourseFees: editChange.courseFees, newcourseDuration: editChange.courseDuration })
        .then((response) => {
          if (response.status === 200) {
            handleEditClose();
            setRefreshKey(oldKey => oldKey + 1);
            toast.success(`New Data updated successfully.`, options);
          }
        });
    }
    else {
      toast.info("Please courseFees or CourseDuration")
    }
  }

  const handleEdit = (id) => {
    const editcourseDataRow = courseList.find(item => item.id === id);
    setEditCourseList(editUcourseDataRow);
    handleEditShow();
  };

  const handleDelete = (id) => {
    Axios.delete(`/course-data/${id}`,).then((response) => {
      if (response.status == 200) {
        setRefreshKey(oldKey => oldKey + 1);
        toast.info(`course deleted.`, options);
      }
    });
  }

  return (
    <div className="wrapper">
      <Container>
        <ToastContainer
          newestOnTop={false}
          rtl={false}
        />

        <Row><Col className="mt-5 mb-2"><h1 className="main_title">Course Data</h1></Col></Row>

        <Row className="mb-2">
          <Col md={2} xs={12} sm={2} lg={2}>
            <Button variant="primary" onClick={handleShow}><FaPlus id="custom_icon" />New course</Button>
          </Col>

          <Col md={4} xs={12} sm={2} lg={6}>
            <div className="mb-3">
              <Form id="search-form">
                <InputGroup id="search-form-course-data">
                  <FormControl
                    placeholder="Search Your Keyword"
                    aria-label="Search Your Keyword"
                    aria-describedby="basic-addon2"
                    onChange={event => { setSearchTerm(event.target.value) }}
                  />
                  <InputGroup.Append>
                    <Button variant="outline-secondary" id="search-button">
                      <FaSearch />
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form>
            </div>
          </Col>
        </Row>

        <Table style={{ width: '70%' }}>
          <thead style={{ background: '#8b8498' }}>
            <tr>
              <th>S.No</th>
              <th>course Name</th>
              <th>course Fees</th>
              <th>course Duration</th>
            </tr>
          </thead>
          <tbody>
            {courseList?.filter((val) => {
              if (search == "") {
                return val
              } else if (val.user_name.toLowerCase().includes(search.toLowerCase())) {
                return val
              }
            }).map((value) => {
              return <tr key={value.id}>
                <td>{sno()}</td>
                <td>{value.course_name}</td>
                <td>{value.course_fees}</td>
                <td>{value.course_duration}</td>
                <td>
                  <FaPencilAlt onClick={() => handleEdit(value.id)} id="data_course_edit" />
                  <FaTrashAlt id="data_course_delete" onClick={() => handleDelete(value.id)} />
                </td>
              </tr>;
            })}
          </tbody>
        </Table>




        {/* Adding new course starts here */}

        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton id="modal-header">
            <Modal.Title>Course Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} controlId="formPlaintext">
                <Form.Label column sm="3">User Name</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    type="text"
                    name="courseName"
                    onChange={handleMasterChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlainetext">
                <Form.Label column sm="3"> User Id</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    type="number"
                    name="courseFees"
                    onChange={handleMasterChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Form.Label column sm="3">Password</Form.Label>
                <Col sm="9">
                  <InputGroup className="mb-3">
                    <FormControl
                      type="varchar"
                      name="courseDuration"
                      required

                      onChange={handleMasterChange}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text id="basic-addon2">
                        <i onClick={togglePasswordVisiblity}><FaEye id="pwd-show-icon" /></i>
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Form.Group>



            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col>
                <Button variant="secondary" onClick={handleClose} id="modal-cancel">
                  Close
                </Button>
              </Col>
              <Col>
                <Button variant="primary" onClick={handleSubmit} id="modal-submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
        {/* Adding new course ends here */}



        {/* Edting course starts here */}
        <Modal show={editshow} onHide={handleEditClose} centered>
          <Modal.Header closeButton id="modal-header">
            <Modal.Title>Edit course data - {editCourseLits.user_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} controlId="formPlaintext">
                <Form.Label column sm="3">course Name</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    type="text"
                    name="courseName"
                    value={editList.course_name}
                    readOnly
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlainetext">
                <Form.Label column sm="3">course Fees</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    type="number"
                    name="courseFees"
                    value={editCourseList.course_fees}
                    readOnly
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Form.Label column sm="3">course Duration</Form.Label>
                <Col sm="9">
                  <InputGroup className="mb-3">
                    <FormControl
                      type="varchar"
                      name="courseDuration"
                      value={editCourseList.course_duration}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text id="basic-addon2">
                        <i onClick={togglePasswordVisiblity}><FaEye id="pwd-show-icon" /></i>
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Form.Group>
              {/* editing course ends here */}

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col>
                <Button variant="secondary"
                  onClick={handleEditClose}
                  id="modal-cancel">
                  Close
                </Button>
              </Col>
              <Col>
                <Button variant="primary"
                  onClick={handleEditSubmit}
                  id="modal-submit">
                  Update
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>


      </Container>
    </div>
  );
};
CourseData.propTypes = {};

CourseData.defaultProps = {};

export default CourseData;