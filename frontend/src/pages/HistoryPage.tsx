import { useEffect, useState } from 'react';
import { Box, Heading, VStack, Text, SimpleGrid, Badge, Button, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Divider } from '@chakra-ui/react';
import { fetchLoanHistory, type LoanResponse } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RiskChart } from '../components/RiskChart';

export const HistoryPage = () => {
    const [history, setHistory] = useState<LoanResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoan, setSelectedLoan] = useState<LoanResponse | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchLoanHistory();
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    const handleViewDetails = (loan: LoanResponse) => {
        setSelectedLoan(loan);
        onOpen();
    };

    if (loading) {
        return <Box minH="100vh" w="100vw" bg="black" color="white" p={8} display="flex" alignItems="center" justifyContent="center"><Text>Loading history...</Text></Box>;
    }

    return (
        <Box minH="100vh" w="100vw" bg="black" color="white" overflowX="hidden">
            <Box px={{ base: 6, md: 12 }} py={12}>
                <Flex justify="space-between" align="center" mb={12}>
                    <VStack align="flex-start">
                        <Heading size="xl">Application History</Heading>
                        <Text color="gray.500">Welcome back, {user?.full_name}</Text>
                    </VStack>
                    <Button variant="outline" colorScheme="gray" _hover={{ bg: 'whiteAlpha.200' }} onClick={() => navigate('/')}>Back to Dashboard</Button>
                </Flex>

                {history.length === 0 ? (
                    <Flex justify="center" align="center" h="50vh" border="1px dashed #333" borderRadius="xl">
                        <Text color="gray.500">No loan applications found. Submit a new application to see it here.</Text>
                    </Flex>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={8}>
                        {history.map((item) => {
                            const isApproved = item.status.includes("APPROVED");

                            return (
                                <Box
                                    key={item.id}
                                    bg="gray.900"
                                    p={6}
                                    borderRadius="xl"
                                    border="1px solid #333"
                                    cursor="pointer"
                                    _hover={{ borderColor: isApproved ? 'green.500' : 'red.500', transform: 'translateY(-2px)' }}
                                    transition="all 0.2s"
                                    onClick={() => handleViewDetails(item)}
                                >
                                    <Flex justify="space-between" mb={4}>
                                        <Badge colorScheme={isApproved ? "green" : "red"}>{item.status}</Badge>
                                        <Text fontSize="xs" color="gray.500">{new Date(item.created_at).toLocaleDateString()}</Text>
                                    </Flex>
                                    <Heading size="md" mb={2}>₹{item.loan_amount.toLocaleString()}</Heading>
                                    <Text fontSize="sm" color="gray.400" mb={4}>Loan Amount</Text>

                                    <VStack align="stretch" spacing={2} fontSize="sm" color="gray.300">
                                        <Flex justify="space-between">
                                            <Text>Applicant:</Text>
                                            <Text color="white">{item.full_name}</Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text>Income:</Text>
                                            <Text color="white">₹{item.income.toLocaleString()}</Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text>Risk Score:</Text>
                                            <Text color={isApproved ? "green.400" : "red.400"} fontWeight="bold">{item.risk_score.toFixed(1)}</Text>
                                        </Flex>
                                    </VStack>
                                </Box>
                            );
                        })}
                    </SimpleGrid>
                )}
            </Box>

            {/* DETAILS MODAL */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
                <ModalOverlay backdropFilter="blur(5px)" />
                <ModalContent bg="gray.900" border="1px solid #333" color="white">
                    <ModalHeader>Application Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {selectedLoan && (
                            <VStack align="stretch" spacing={6}>
                                <Box>
                                    <Heading size="md" mb={2} color={selectedLoan.status.includes("APPROVED") ? "green.400" : "red.400"}>
                                        {selectedLoan.status}
                                    </Heading>
                                    <Text color="gray.400">Risk Score: {selectedLoan.risk_score.toFixed(1)}/100</Text>
                                </Box>

                                <Divider borderColor="gray.700" />

                                <Box>
                                    <Heading size="sm" mb={4} color="gray.300">Input Data</Heading>
                                    <SimpleGrid columns={2} spacing={4}>
                                        <Box>
                                            <Text fontSize="xs" color="gray.500">FULL NAME</Text>
                                            <Text>{selectedLoan.full_name}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color="gray.500">INCOME</Text>
                                            <Text>₹{selectedLoan.income.toLocaleString()}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color="gray.500">LOAN AMOUNT</Text>
                                            <Text>₹{selectedLoan.loan_amount.toLocaleString()}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color="gray.500">CREDIT SCORE</Text>
                                            <Text>{selectedLoan.credit_score}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color="gray.500">AGE</Text>
                                            <Text>{selectedLoan.age}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color="gray.500">EMPLOYMENT</Text>
                                            <Text>{selectedLoan.years_employed} Years</Text>
                                        </Box>
                                    </SimpleGrid>
                                </Box>

                                <Divider borderColor="gray.700" />

                                <Box>
                                    <Heading size="sm" mb={2} color="gray.300">Risk Analysis</Heading>
                                    {selectedLoan.risk_factors && selectedLoan.risk_factors.length > 0 ? (
                                        <RiskChart
                                            factors={selectedLoan.risk_factors}
                                            formData={{
                                                full_name: selectedLoan.full_name,
                                                income: selectedLoan.income,
                                                loan_amount: selectedLoan.loan_amount,
                                                credit_score: selectedLoan.credit_score,
                                                age: selectedLoan.age,
                                                years_employed: selectedLoan.years_employed,
                                                gender: selectedLoan.gender
                                            }}
                                        />
                                    ) : (
                                        <Text color="gray.500" fontSize="sm">No detailed risk analysis available for this application.</Text>
                                    )}
                                </Box>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};
