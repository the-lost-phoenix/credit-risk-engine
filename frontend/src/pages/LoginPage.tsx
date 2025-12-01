// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, useToast, Container } from '@chakra-ui/react';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const toast = useToast();

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const data = await loginUser(formData);
            login(data.access_token, { email, full_name: 'User' }); // Ideally we fetch user details here

            toast({ title: "Login Successful", status: "success" });
            navigate('/'); // Redirect to home/dashboard
        } catch (error) {
            console.error("Login error:", error);
            toast({ title: "Login Failed", description: "Invalid credentials or server error.", status: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box minH="100vh" w="100vw" bg="black" color="white" display="flex" alignItems="center" justifyContent="center" position="fixed" top="0" left="0" zIndex="9999">
            <Container maxW="md" bg="gray.900" p={8} borderRadius="xl" border="1px solid #333" boxShadow="2xl">
                <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                    <Heading size="lg" letterSpacing="tight">Login</Heading>
                    <FormControl>
                        <FormLabel color="gray.400">Email</FormLabel>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required bg="black" border="1px solid #333" _focus={{ borderColor: '#E53E3E' }} />
                    </FormControl>
                    <FormControl>
                        <FormLabel color="gray.400">Password</FormLabel>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required bg="black" border="1px solid #333" _focus={{ borderColor: '#E53E3E' }} />
                    </FormControl>
                    <Button type="submit" colorScheme="red" w="full" isLoading={loading} size="lg" fontSize="md">LOGIN</Button>
                    <Text fontSize="sm" color="gray.500">
                        Don't have an account? <a href="/register" style={{ color: '#E53E3E' }}>Register</a>
                    </Text>
                </VStack>
            </Container>
        </Box>
    );
};
