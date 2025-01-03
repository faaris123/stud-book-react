import { useEffect, useState } from "react";
import { Col, Button, Container, Form, Row, Pagination } from "react-bootstrap";
import Student from "./Student";

const Classroom = () => {

    const [students, setStudents] = useState([]);
    const [searchName, setSearchName] = useState(''); 
    const [searchMajor, setSearchMajor] = useState(''); 
    const [searchInterest, setSearchInterest] = useState('');
    const [page, setPage] = useState(1); 

    /* Handler functions for when user types search criteria */
    function handleName(e) {
        setSearchName(e.target.value)
        setPage(1);
    }

    function handelMajor(e) {
        setSearchMajor(e.target.value);
        setPage(1);
    }

    function handleInterest(e) {
        setSearchInterest(e.target.value)
        setPage(1);
    }

    /* Used the code from the lecture example code */
    useEffect(() => {
        fetch("https://cs571api.cs.wisc.edu/rest/f24/hw4/students", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setStudents(data);
        })
    }, []);

    /* Used similar filter code as in HW2, changed the interest search to account for people with 0 interets with help from Office Hours */
    const filter = students.filter(n => {
        const student_name = (n.name.first + " " + n.name.last).trim().toLowerCase();
        const name_search = (searchName === student_name) || (student_name.includes(searchName.trim().toLocaleLowerCase()))
        
        const student_major = (n.major).trim().toLowerCase();
        const major_search = (searchMajor === student_major) || (student_major.includes(searchMajor.trim().toLowerCase()))

        const student_interest = (n.interests).map(m => m.trim().toLowerCase());
        const interest_search = ((searchInterest === "") && (student_interest.length === 0)) || (student_interest.some(interest => interest.includes(searchInterest.trim().toLowerCase())))

        return name_search && major_search && interest_search
    });

    /* Used this source to figure out how to round up: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil */
    const total_pages = Math.ceil(filter.length / 24);

    /* Used this source and lecture code examples to figure out the Pagination: https://react-bootstrap.netlify.app/docs/components/pagination/ */
    const items = [];
    for (let number = 1; number <= total_pages; number++) {
        items.push(
            <Pagination.Item onClick={() => setPage(number)} key = {number} active = {number === page}>
                {number}
            </Pagination.Item>
        );
    }

    /* Took the slicing part directly from lecture code example, just changed the value to reflect the project directions */
    /* I used this source to understand Form Control and the onChange attribute: https://www.geeksforgeeks.org/react-bootstrap-form-controls/ */
    /* I also used this source to get a better understaning about the diablement for previous and next: https://github.com/themesberg/flowbite-react/issues/726 */
    return <div>
        <h1>Badger Book</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control id="searchName" value = {searchName} onChange = {handleName}/>
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control id="searchMajor" value = {searchMajor} onChange = {handelMajor}/>
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control id="searchInterest" value = {searchInterest} onChange = {handleInterest}/>
            <br />
            <Button variant="neutral" onClick={() => {
                setSearchMajor("")
                setSearchName("")
                setSearchInterest("")
            }}>Reset Search</Button>
        </Form>
        <br />
        <Container fluid>
            <Row>There are {filter.length} student(s) matching your search</Row>
            <br />
            <Row>
                {filter.slice(((page) - 1) * 24, page * 24).map(student => (
                    <Col xs = {12} sm = {12} md = {6} lg = {4} xl = {3} key = {student.id}>
                        <Student {...student}/>
                    </Col>
                ))}
            </Row>
            <Row>
                <Pagination>
                    <Pagination.Prev onClick={() => setPage(page - 1)} disabled = {page === 1}>Previous</Pagination.Prev>
                    {items}
                    <Pagination.Next onClick={() => setPage(page + 1)} disabled = {page === total_pages}>Next</Pagination.Next>
                </Pagination>
            </Row>
        </Container>
    </div>

}

export default Classroom;
