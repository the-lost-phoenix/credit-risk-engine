import { useEffect, useState } from 'react';
import { Box, Heading, VStack, Text, SimpleGrid, Badge, Button, Flex } from '@chakra-ui/react';
import { fetchHistory, type HistoryItem } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const HistoryPage = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchHistory();
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    if (loading) {
        return <Box minH="100vh" w="100vw" bg="black" color="white" p={8} display="flex" alignItems="center" justifyContent="center"><Text>Loading history...</Text></Box>;
    }

    return (
        <Box minH="100vh" w="100vw" bg="black" color="white" overflowX="hidden">
            <Box px={{ base: 6, md: 12 }} py={12}>
                <Flex justify="space-between" align="center" mb={12}>
                    <VStack align="flex-start">
                        <Heading size="xl">Analysis History</Heading>
                        <Text color="gray.500">Welcome back, {user?.full_name}</Text>
                    </VStack>
                    <Button variant="outline" colorScheme="gray" _hover={{ bg: 'whiteAlpha.200' }} onClick={() => navigate('/')}>Back to Dashboard</Button>
                </Flex>

                {history.length === 0 ? (
                    <Flex justify="center" align="center" h="50vh" border="1px dashed #333" borderRadius="xl">
                        <Text color="gray.500">No analysis history found. Run a scan to see it here.</Text>
                    </Flex>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={8}>
                        {history.map((item) => {
                            const result = JSON.parse(item.result);
                            const isVerified = result.is_verified;
                            const salary = result.estimated_salary;

                            return (
                                <Box key={item.id} bg="gray.900" p={6} borderRadius="xl" border="1px solid #333" _hover={{ borderColor: '#E53E3E', transform: 'translateY(-2px)' }} transition="all 0.2s">
                                    <Flex justify="space-between" mb={4}>
                                        <Badge colorScheme={isVerified ? "green" : "red"}>{isVerified ? "VERIFIED" : "FAILED"}</Badge>
                                        <Text fontSize="xs" color="gray.500">{new Date(item.created_at).toLocaleDateString()}</Text>
                                    </Flex>
                                    <Heading size="md" mb={2}>₹{salary.toLocaleString()}</Heading>
                                    <Text fontSize="sm" color="gray.400" mb={4}>Estimated Salary</Text>

                                    <VStack align="stretch" spacing={2} fontSize="sm" color="gray.300">
                                        <Flex justify="space-between">
                                            <Text>File:</Text>
                                            <Text color="white" maxW="150px" isTruncated>{item.filename}</Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text>Avg Balance:</Text>
                                            <Text color="white">₹{Math.round(result.average_balance || 0).toLocaleString()}</Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text>Bounces:</Text>
                                            <Text color={result.cheque_bounces > 0 ? "red.400" : "green.400"}>{result.cheque_bounces}</Text>
                                        </Flex>
                                    </VStack>
                                </Box>
                            );
                        })}
                    </SimpleGrid>
                )}
            </Box>
        </Box>
    );
};
