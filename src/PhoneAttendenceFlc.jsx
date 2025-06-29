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
  Heading,
} from "@chakra-ui/react";

const PhoneAttendenceFlc = () => {
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const fetchUser = async () => {
    setUser(null);
    setFeedback("");
    if (!phone) return;

    setLoading(true);
    try {
      const res = await fetch(`https://vrc-server-110406681774.asia-south1.run.app/flcattendence/${phone}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        setFeedback("❌ User not found. Please register here:");
      }
    } catch (error) {
      setFeedback("❌ Server error. Please try again.");
    }
    setLoading(false);
  };

  const submitAttendance = async () => {
    if (!user?._id) return;

    try {
      const res = await fetch("https://vrc-server-110406681774.asia-south1.run.app/manual-flc-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user._id,
          status,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback("✅ Attendance submitted successfully.");
        setPhone("");
        setUser(null);
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
            ❌ User not found. Please{" "}
            <Link
              href="/"
              color="teal.500"
              isExternal
            >
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
        <Heading size="md">FLC Volunteer Attendance</Heading>
        <Input
          placeholder="Enter WhatsApp Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button colorScheme="teal" onClick={fetchUser} isLoading={loading}>
          Fetch User
        </Button>

        {user && (
          <Box w="full" textAlign="left" mt={4}>
            <Text><b>Name:</b> {user.name}</Text>
            <Text><b>Phone:</b> {user.phone}</Text>
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

export default PhoneAttendenceFlc;
