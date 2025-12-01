import { Box, Button, Container, Flex, Heading, Text, VStack, SimpleGrid, Image, Link, useToast } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { ApplyPage } from './ApplyPage'; // Import your existing form
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
    const [showApp, setShowApp] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
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

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Box minH="100vh" bg="black" color="white" overflowX="hidden">
            {/* Navbar */}
            <Flex p={6} px={{ base: 6, md: 12 }} justify="space-between" align="center" borderBottom="1px solid #333" position="sticky" top={0} zIndex={10} bg="rgba(0,0,0,0.8)" backdropFilter="blur(10px)">
                <Heading size="md" letterSpacing="wider">CREDIT<span style={{ color: '#E53E3E' }}>RISK</span>.AI</Heading>
                <Flex gap={8} display={{ base: 'none', md: 'flex' }} align="center">
                    <Text cursor="pointer" _hover={{ color: '#E53E3E' }} transition="color 0.2s" onClick={() => scrollToSection('features')}>Features</Text>
                    <Text cursor="pointer" _hover={{ color: '#E53E3E' }} transition="color 0.2s" onClick={() => scrollToSection('stats')}>Enterprise</Text>

                    {isAuthenticated ? (
                        <>
                            <Link href="/history" _hover={{ color: '#E53E3E' }}>History</Link>
                            <Button size="sm" variant="outline" colorScheme="red" onClick={logout}>Logout ({user?.full_name})</Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" _hover={{ color: '#E53E3E' }}>Login</Link>
                            <Button size="sm" colorScheme="red" onClick={() => window.location.href = '/register'}>Register</Button>
                        </>
                    )}
                </Flex>
            </Flex>

            {/* Hero Section - Full Width */}
            <Box px={{ base: 8, md: 24 }} py={20} minH="90vh" display="flex" alignItems="center">
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={20} alignItems="center" w="full">
                    <VStack align="flex-start" spacing={8}>
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
            </Box>

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