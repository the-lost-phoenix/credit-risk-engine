// src/pages/ApplyPage.tsx
import { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, Select,
    VStack, Heading, useToast, InputGroup, InputRightElement, SimpleGrid, Text, Icon, Divider, Flex
} from '@chakra-ui/react';
import { AttachmentIcon, CheckCircleIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { submitApplication, uploadBankStatement, type LoanApplication, type LoanResponse } from '../services/api';
import { RiskChart } from '../components/RiskChart';
import { useAuth } from '../context/AuthContext';

export const ApplyPage = () => {
    const toast = useToast();
    const { logout } = useAuth();

    // --- STATES ---
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<LoanResponse | null>(null);

    // Simulation States
    const [cibilScore, setCibilScore] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState<LoanApplication>({
        full_name: '',
        income: 0,
        loan_amount: 0,
        credit_score: 0,
        age: 0,
        years_employed: 0,
        gender: 'M'
    });

    // --- HANDLERS ---
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === "gender" || name === "full_name") ? value : Number(value)
        }));
    };

    // 1. Mock CIBIL Fetch
    const fetchCibil = () => {
        toast({ title: "Encrypting connection...", status: "info", duration: 800 });
        setTimeout(() => {
            const mockScore = 780;
            setCibilScore(mockScore);
            setFormData(prev => ({ ...prev, credit_score: mockScore }));
            toast({ title: "Bureau Data Received", description: `TransUnion Score: ${mockScore}`, status: "success" });
        }, 1500);
    };

    // 2. REAL Backend File Upload
    const handleFileUpload = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            try {
                const analysis = await uploadBankStatement(file);

                setUploadSuccess(true);
                setFormData(prev => ({ ...prev, income: analysis.estimated_salary }));

                toast({
                    title: "Statement Verified",
                    description: `Salary: ₹${analysis.estimated_salary.toLocaleString()} | Avg Bal: ₹${Math.round(analysis.average_balance).toLocaleString()} | Bounces: ${analysis.cheque_bounces}`,
                    status: "success",
                    position: "top",
                    duration: 5000
                });

            } catch (error) {
                toast({ title: "Upload Failed", description: "Could not read CSV.", status: "error" });
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setResult(null);
        try {
            const response = await submitApplication(formData);
            setResult(response);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            toast({ title: "API Connection Error", status: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box minH="100vh" w="100vw" bg="black" color="white" p={0} overflowX="hidden">
            {/* Header */}
            <Box bg="black" borderBottom="1px solid #333" py={6} px={8} position="sticky" top={0} zIndex={10}>
                <Flex justify="space-between" align="center">
                    <VStack align="flex-start" spacing={0}>
                        <Heading size="lg" color="white">RISK ASSESSMENT<span style={{ color: '#E53E3E' }}>.EXE</span></Heading>
                        <Text color="gray.500" letterSpacing="2px" fontSize="xs" textTransform="uppercase">Enterprise Credit Scoring Engine v2.0</Text>
                    </VStack>
                    <Button size="sm" variant="outline" onClick={() => { logout(); window.location.reload(); }} _hover={{ bg: 'whiteAlpha.200' }}>EXIT SESSION</Button>
                </Flex>
            </Box>

            <Box p={8} h="calc(100vh - 100px)">
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} h="full">

                    {/* LEFT COLUMN: THE FORM */}
                    <Box h="full" overflowY="auto" pr={4} css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-track': { background: '#111' }, '&::-webkit-scrollbar-thumb': { background: '#333' } }}>
                        <VStack spacing={8} align="stretch" pb={10}>

                            {/* Identity Section */}
                            <Box>
                                <Heading size="sm" color="gray.500" mb={4} textTransform="uppercase">01 // Identity Verification</Heading>
                                <VStack spacing={4}>
                                    <FormControl>
                                        <FormLabel color="gray.400" fontSize="xs" textTransform="uppercase">Full Legal Name</FormLabel>
                                        <Input name="full_name" placeholder="JOHN DOE" _placeholder={{ color: 'gray.700' }} onChange={handleChange} bg="rgba(255,255,255,0.05)" border="none" _focus={{ border: '1px solid #E53E3E', bg: 'black' }} />
                                    </FormControl>
                                    <SimpleGrid columns={2} spacing={6}>
                                        <FormControl>
                                            <FormLabel color="gray.400" fontSize="xs" textTransform="uppercase">Age</FormLabel>
                                            <Input name="age" type="number" onChange={handleChange} bg="rgba(255,255,255,0.05)" border="none" _focus={{ border: '1px solid #E53E3E', bg: 'black' }} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel color="gray.400" fontSize="xs" textTransform="uppercase">Gender</FormLabel>
                                            <Select name="gender" onChange={handleChange} color="gray.300" bg="rgba(255,255,255,0.05)" border="none" _focus={{ border: '1px solid #E53E3E', bg: 'black' }}>
                                                <option style={{ background: 'black' }} value="M">Male</option>
                                                <option style={{ background: 'black' }} value="F">Female</option>
                                            </Select>
                                        </FormControl>
                                    </SimpleGrid>
                                </VStack>
                            </Box>

                            <Divider borderColor="gray.800" />

                            {/* Financial Section */}
                            <Box>
                                <Heading size="sm" color="gray.500" mb={4} textTransform="uppercase">02 // Financial Analysis</Heading>
                                <VStack spacing={5}>

                                    {/* CIBIL */}
                                    <FormControl>
                                        <FormLabel color="gray.400" fontSize="xs" textTransform="uppercase">PAN Verification</FormLabel>
                                        <InputGroup>
                                            <Input placeholder="ABCDE1234F" textTransform="uppercase" letterSpacing="1px" bg="rgba(255,255,255,0.05)" border="none" _focus={{ border: '1px solid #E53E3E', bg: 'black' }} />
                                            <InputRightElement width="8rem">
                                                <Button h="1.75rem" size="xs" colorScheme={cibilScore ? "green" : "gray"} variant="outline" onClick={fetchCibil}>
                                                    {cibilScore ? "VERIFIED" : "FETCH BUREAU"}
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>

                                    {/* File Upload - The Industrial Box */}
                                    <FormControl>
                                        <FormLabel color="gray.400" fontSize="xs" textTransform="uppercase">Bank Statement Analysis</FormLabel>
                                        <Box
                                            border="1px dashed"
                                            borderColor={uploadSuccess ? "green.500" : "gray.700"}
                                            p={6}
                                            textAlign="center"
                                            cursor="pointer"
                                            position="relative"
                                            bg="rgba(255,255,255,0.02)"
                                            _hover={{ bg: "rgba(255,255,255,0.05)", borderColor: "white" }}
                                            transition="all 0.2s"
                                        >
                                            <Input
                                                type="file"
                                                opacity={0}
                                                position="absolute"
                                                top={0} left={0} height="100%" width="100%"
                                                onChange={handleFileUpload}
                                                cursor="pointer"
                                            />
                                            <VStack spacing={2}>
                                                <Icon as={uploadSuccess ? CheckCircleIcon : AttachmentIcon} color={uploadSuccess ? "green.500" : "gray.500"} boxSize={6} />
                                                <Text fontSize="xs" color="gray.300" fontWeight="bold" letterSpacing="1px">
                                                    {isUploading ? "PROCESSING DATA..." : uploadSuccess ? "ANALYSIS COMPLETE" : "DROP STATEMENT CSV"}
                                                </Text>
                                            </VStack>
                                        </Box>
                                    </FormControl>

                                    {/* Auto-Filled Fields */}
                                    <SimpleGrid columns={2} spacing={6} w="full">
                                        <FormControl isDisabled={uploadSuccess}>
                                            <FormLabel color="gray.600" fontSize="xs">DETECTED INCOME</FormLabel>
                                            <Input name="income" type="number" value={formData.income} onChange={handleChange} color={uploadSuccess ? "green.400" : "white"} bg="rgba(255,255,255,0.05)" border="none" />
                                        </FormControl>
                                        <FormControl isDisabled={!!cibilScore}>
                                            <FormLabel color="gray.600" fontSize="xs">CREDIT SCORE</FormLabel>
                                            <Input name="credit_score" type="number" value={formData.credit_score} onChange={handleChange} color={cibilScore ? "green.400" : "white"} bg="rgba(255,255,255,0.05)" border="none" />
                                        </FormControl>
                                    </SimpleGrid>

                                    <FormControl>
                                        <FormLabel color="gray.400" fontSize="xs" textTransform="uppercase">Loan Amount Request</FormLabel>
                                        <Input name="loan_amount" type="number" onChange={handleChange} fontSize="lg" bg="rgba(255,255,255,0.05)" border="none" _focus={{ border: '1px solid #E53E3E', bg: 'black' }} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel color="gray.400" fontSize="xs" textTransform="uppercase">Years Employed</FormLabel>
                                        <Input name="years_employed" type="number" onChange={handleChange} bg="rgba(255,255,255,0.05)" border="none" _focus={{ border: '1px solid #E53E3E', bg: 'black' }} />
                                    </FormControl>
                                </VStack>
                            </Box>

                            <Button
                                colorScheme="red"
                                height="60px"
                                fontSize="xl"
                                mt={6}
                                onClick={handleSubmit}
                                isLoading={loading}
                                loadingText="RUNNING MODEL..."
                                _hover={{ transform: 'translateY(-2px)', boxShadow: '0 0 20px #E53E3E' }}
                                transition="all 0.2s"
                                bg="#E53E3E"
                            >
                                INITIATE RISK SCAN
                            </Button>
                        </VStack>
                    </Box>

                    {/* RIGHT COLUMN: RESULTS */}
                    <Box h="full" position="relative">
                        <Heading size="sm" color="gray.500" mb={4} textTransform="uppercase">03 // AI Report</Heading>

                        {!result ? (
                            <Box
                                height="80%"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                bg="rgba(255,255,255,0.02)"
                                border="1px dashed"
                                borderColor="gray.800"
                                borderRadius="md"
                            >
                                <VStack>
                                    <Icon as={WarningTwoIcon} color="gray.800" boxSize={12} />
                                    <Text color="gray.600" fontSize="sm" letterSpacing="1px">AWAITING INPUT DATA...</Text>
                                </VStack>
                            </Box>
                        ) : (
                            <Box h="full" overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-track': { background: '#111' }, '&::-webkit-scrollbar-thumb': { background: '#333' } }}>
                                <Box
                                    bg={result.status.includes("APPROVED") ? "green.900" : "#2A0A0A"} // Darker background for result
                                    border="1px solid"
                                    borderColor={result.status.includes("APPROVED") ? "green.500" : "red.500"}
                                    p={6}
                                    textAlign="center"
                                    mb={6}
                                >
                                    <Heading size="2xl" color={result.status.includes("APPROVED") ? "green.400" : "red.500"} mb={2}>
                                        {result.status}
                                    </Heading>
                                    <Text color="gray.300" letterSpacing="2px">CONFIDENCE SCORE: {result.risk_score.toFixed(1)}/100</Text>
                                </Box>

                                <RiskChart factors={result.risk_factors} formData={formData} />
                            </Box>
                        )}
                    </Box>

                </SimpleGrid>
            </Box>
        </Box>
    );
};