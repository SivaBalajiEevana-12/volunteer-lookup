// components/PhoneAttendanceForm.jsx
import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Select,
  Link,
} from "@chakra-ui/react";

const PhoneAttendanceForm = () => {
  const [phone, setPhone] = useState("");
  const [volunteer, setVolunteer] = useState(null);
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const fetchVolunteer = async () => {
    setVolunteer(null);
    setFeedback("");
    if (!phone) return;

    setLoading(true);
    try {
      const res = await fetch(`https://vrc-server-production.up.railway.app/attendence/${phone}`);
      const data = await res.json();
      if (res.ok) {
        setVolunteer(data);
      } else {
        setFeedback("❌ Volunteer not found. Please register here: https://yourdomain.com/register");
      }
    } catch (error) {
      setFeedback("❌ Server error. Please try again.");
    }
    setLoading(false);
  };

  const submitAttendance = async () => {
    if (!volunteer?._id) return;

    try {
      const res = await fetch("https://vrc-server-production.up.railway.app/manual-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          volunteerId: volunteer._id,
          status,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback("✅ Attendance taken successfully.");
        setPhone("");
        setVolunteer(null);
      } else {
        setFeedback(`❌ ${data.message || "Error saving attendance."}`);
      }
    } catch (err) {
      setFeedback("❌ Network error");
    }
  };

  const renderFeedback = () => {
    if (!feedback) return null;

    const isSuccess = feedback.startsWith("✅");
    const isRegister = feedback.includes("register");

    return (
      <Alert status={isSuccess ? "success" : "error"} mt={4}>
        <AlertIcon />
        {isRegister ? (
          <>
            ❌ Volunteer not found. Please{" "}
            <Link href="" color="teal.500" isExternal>
              register here
            </Link>
            .
          </>
        ) : (
          feedback
        )}
      </Alert>
    );
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <Input
          placeholder="Enter WhatsApp Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button colorScheme="teal" onClick={fetchVolunteer} isLoading={loading}>
          Fetch Volunteer
        </Button>

        {volunteer && (
          <Box w="full" textAlign="left" mt={4}>
            <Text><b>Name:</b> {volunteer.name}</Text>
            <Text><b>College/Company:</b> {volunteer.collegeCompany}</Text>
            <Text><b>Gender:</b> {volunteer.gender}</Text>
            <Text><b>Age:</b> {volunteer.age}</Text>
            <Text><b>Locality:</b> {volunteer.currentLocality}</Text>
            <Text><b>Previous Volunteer:</b> {volunteer.previousVolunteer}</Text>

            <Select mt={4} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </Select>

            <Button mt={2} colorScheme="blue" onClick={submitAttendance}>
              Submit Attendance
            </Button>
          </Box>
        )}

        {renderFeedback()}
      </VStack>
    </Box>
  );
};

export default PhoneAttendanceForm;
