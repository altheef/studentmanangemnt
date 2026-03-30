let student = []

const form = document.getElementById("studentform")
const tableBody = document.getElementById("tablebody")
const editstudentinput = document.getElementById("editstudent")
const searchstudentinput = document.getElementById("searchstudent")

// Load data from sessionStorage
if (sessionStorage.getItem("student")) {
    student = JSON.parse(sessionStorage.getItem("student"))
    displayUsers()
}

// Form Submit - CREATE + UPDATE
form.addEventListener("submit", (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value.trim()
    const phone = document.getElementById("phone").value.trim()
    const email = document.getElementById("email").value.trim()
    const mark = document.getElementById("mark").value.trim()

    // Name should not be empty
    if (name === "") {
        alert("Name should not be empty")
        return
    }

    // Email should not be duplicate (when adding new student)
    if (editstudentinput.value == "") {
        const isDuplicate = student.some(s => s.email.toLowerCase() === email.toLowerCase())
        if (isDuplicate && email !== "") {
            alert("Email should not be duplicate")
            return
        }
    }

    if (editstudentinput.value == "") {
        student.push({ name, phone, email, mark })
    } else {
        student[editstudentinput.value] = { name, phone, email, mark }
        editstudentinput.value = ""
    }

    form.reset()
    sessionStorage.setItem("student", JSON.stringify(student))
    displayUsers()
})

// Real-time Search
searchstudentinput.addEventListener("input", displayUsers)

// Display function with search filter
function displayUsers() {
    tableBody.innerHTML = ""

    const searchTerm = searchstudentinput.value.toLowerCase().trim()

    // Filter students by name only - Real-time search
    const filteredStudents = student.filter(s => 
        s.name.toLowerCase().includes(searchTerm)
    )

    if (filteredStudents.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    No matching students found
                </td>
            </tr>`
        return
    }

    filteredStudents.forEach((stud) => {
        const originalIndex = student.findIndex(s => s === stud)

        tableBody.innerHTML += `
        <tr>
            <td>${originalIndex + 1}</td>
            <td>${stud.name}</td>
            <td>${stud.phone}</td>
            <td>${stud.email}</td>
            <td>${stud.mark}</td>
            <td>
                <div class="d-flex">
                    <button onclick="editstudent(${originalIndex})" class="btn btn-warning ms-2">Edit</button>
                    <button onclick="deletestudent(${originalIndex})" class="btn btn-danger ms-2">Delete</button>
                </div>
            </td>
        </tr>
        `
    })
}

// Edit Student
const editstudent = (index) => {
    document.getElementById("name").value = student[index].name
    document.getElementById("phone").value = student[index].phone
    document.getElementById("email").value = student[index].email
    document.getElementById("mark").value = student[index].mark
    editstudentinput.value = index
}

// Delete Student
const deletestudent = (index) => {
    if (confirm("Are you sure you want to delete?")) {
        student.splice(index, 1)
        sessionStorage.setItem("student", JSON.stringify(student))
        displayUsers()
    }
}