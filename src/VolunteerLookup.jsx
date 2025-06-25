import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Spinner,
  Heading,
  Badge,
  Divider,
} from "@chakra-ui/react";

const VolunteerLookup = () => {
  const [phone, setPhone] = useState("");
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchVolunteer = async () => {
    setVolunteer(null);
    setErrorMsg("");
    if (!phone) return;

    setLoading(true);
    try {
      const res = await fetch(`https://vrc-server-production.up.railway.app/user/${phone}`);
      const data = await res.json();
      if (res.ok) {
        setVolunteer(data);
      } else {
        setErrorMsg(data.message || "Volunteer not found.");
      }
    } catch (err) {
      setErrorMsg("❌ Failed to fetch data. Server may be down.");
    }
    setLoading(false);
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Check Your Assigned Service</Heading> 
        <Input
          placeholder="Enter WhatsApp Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button colorScheme="teal" onClick={fetchVolunteer} isDisabled={!phone}>
          {loading ? <Spinner size="sm" /> : "Fetch Volunteer"}
        </Button>

        {errorMsg && (
          <Alert status="error">
            <AlertIcon />
            {errorMsg}
          </Alert>
        )}

        {volunteer && (
          <Box borderWidth={1} borderRadius="xl" p={4} shadow="md">
            <Heading size="md" color="teal.600" mb={2}>
              {volunteer.name}
            </Heading>
            <Text><b>Phone:</b> {volunteer.whatsappNumber}</Text>
            <Text><b>College/Company:</b> {volunteer.collegeCompany}</Text>
            <Text><b>Age:</b> {volunteer.age}</Text>
            <Text><b>Gender:</b> {volunteer.gender}</Text>
            <Text><b>Locality:</b> {volunteer.currentLocality}</Text>
            {/* <Text>
              <b>Previous Volunteer:</b>{" "}
              <Badge colorScheme={volunteer.previousVolunteer === "Yes" ? "green" : "red"}>
                {volunteer.previousVolunteer}
              </Badge>
            </Text> */}
            {/* <Text><b>Service Availability:</b> {volunteer.serviceAvailability}</Text> */}
            <Text><b>Service Type:</b> {volunteer.serviceType || "N/A"}</Text>
            <Divider my={2} />
            <Text fontSize="sm" color="gray.500">
              Submitted At: {new Date(volunteer.submittedAt).toLocaleString()}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default VolunteerLookup;
