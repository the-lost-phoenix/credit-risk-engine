import { useState } from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    VStack,
    Image,
    SimpleGrid,
    Container,
    Flex,
    Link,
    useToast
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApplyPage } from './ApplyPage';

export const LandingPage = () => {
    const [showApp, setShowApp] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    if (showApp) {
        return <ApplyPage />;
    }

    const handleStartAnalysis = () => {
        if (isAuthenticated) {
            setShowApp(true);
        } else {
            toast({
                title: "Authentication Required",
                description: "Please login to access the risk engine.",
                status: "warning",
                position: "top",
                duration: 3000
            });
            navigate('/login');
        }
    };

    return (
        <Box bg="black" minH="100vh" color="white">
            <Container maxW="container.xl" pt={20} pb={20}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
                    <VStack align="flex-start" spacing={6}>
                        <Heading size="4xl" lineHeight="1.1" letterSpacing="-1px">
                            UNCOMPROMISED <br />
                            <span style={{ color: '#E53E3E' }}>FINANCIAL SECURITY</span>
                        </Heading>
                        <Text fontSize="2xl" color="gray.400" maxW="600px" lineHeight="1.6">
                            The world's most advanced AI-powered credit risk engine.
                            Analyze bank statements, predict defaults, and audit decisions in milliseconds.
                        </Text>
                        <Button
                            size="lg"
                            rightIcon={<ArrowForwardIcon />}
                            onClick={handleStartAnalysis}
                            px={12}
                            py={8}
                            fontSize="xl"
                            colorScheme="red"
                            bg="#E53E3E"
                            _hover={{ bg: "red.600", transform: "translateY(-2px)", boxShadow: "0 10px 20px rgba(229, 62, 62, 0.3)" }}
                            transition="all 0.2s"
                        >
                            START ANALYSIS
                        </Button>
                    </VStack>

                    {/* 3D Visualization Image */}
                    <Box
                        position="relative"
                        role="group"
                    >
                        <Box
                            position="absolute"
                            inset="-20px"
                            bgGradient="radial(circle, rgba(229,62,62,0.2) 0%, transparent 70%)"
                            filter="blur(40px)"
                            zIndex={0}
                        />
                        <Image
                            src="/risk_vis.png"
                            alt="3D Risk Visualization"
                            borderRadius="2xl"
                            border="1px solid #333"
                            boxShadow="2xl"
                            position="relative"
                            zIndex={1}
                            _groupHover={{ transform: "scale(1.02)" }}
                            transition="transform 0.5s ease"
                        />
                    </Box>
                </SimpleGrid>
            </Container>

            {/* Features / Stats Section */}
            <Box id="features" borderTop="1px solid #333" py={24} bg="gray.900">
                <Container maxW="container.xl">
                    <VStack spacing={16}>
                        <Heading size="2xl" textAlign="center">Why Choose <span style={{ color: '#E53E3E' }}>CreditRisk.AI</span>?</Heading>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12} w="full">
                            <Box p={8} bg="black" border="1px solid #333" borderRadius="xl">
                                <Heading size="lg" mb={4} color="#E53E3E">01.</Heading>
                                <Heading size="md" mb={4}>Instant Analysis</Heading>
                                <Text color="gray.400">Process complex bank statements in under 200ms using our proprietary parsing engine.</Text>
                            </Box>
                            <Box p={8} bg="black" border="1px solid #333" borderRadius="xl">
                                <Heading size="lg" mb={4} color="#E53E3E">02.</Heading>
                                <Heading size="md" mb={4}>Fraud Detection</Heading>
                                <Text color="gray.400">Identify circular transactions, gambling patterns, and salary inflation automatically.</Text>
                            </Box>
                            <Box p={8} bg="black" border="1px solid #333" borderRadius="xl">
                                <Heading size="lg" mb={4} color="#E53E3E">03.</Heading>
                                <Heading size="md" mb={4}>Bank Grade Security</Heading>
                                <Text color="gray.400">256-bit encryption and ISO 27001 compliant data handling for enterprise use.</Text>
                            </Box>
                        </SimpleGrid>
                    </VStack>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box id="stats" borderTop="1px solid #333" py={20} bg="black">
                <Container maxW="container.xl">
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} textAlign="center">
                        <Box>
                            <Heading color="#E53E3E" size="3xl">98%</Heading>
                            <Text mt={2} color="gray.400" fontSize="lg">Accuracy Rate</Text>
                        </Box>
                        <Box>
                            <Heading color="#E53E3E" size="3xl">0.2s</Heading>
                            <Text mt={2} color="gray.400" fontSize="lg">Inference Time</Text>
                        </Box>
                        <Box>
                            <Heading color="#E53E3E" size="3xl">256</Heading>
                            <Text mt={2} color="gray.400" fontSize="lg">Encryption Bits</Text>
                        </Box>
                        <Box>
                            <Heading color="#E53E3E" size="3xl">RBI</Heading>
                            <Text mt={2} color="gray.400" fontSize="lg">Compliant</Text>
                        </Box>
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Footer / Support */}
            <Box id="footer" borderTop="1px solid #333" py={12} bg="gray.900">
                <Container maxW="container.xl">
                    <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={6}>
                        <Text color="gray.500">© 2025 CreditRisk.AI Inc. All rights reserved.</Text>
                        <Flex gap={6}>
                            <Link href="#" color="gray.500" _hover={{ color: 'white' }}>Privacy Policy</Link>
                            <Link href="#" color="gray.500" _hover={{ color: 'white' }}>Terms of Service</Link>
                            <Link href="#" color="gray.500" _hover={{ color: 'white' }}>Contact Support</Link>
                        </Flex>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
};