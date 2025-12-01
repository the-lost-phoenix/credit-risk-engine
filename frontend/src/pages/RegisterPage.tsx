// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, useToast, Container } from '@chakra-ui/react';
import { registerUser } from '../services/api';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser({ email, password, full_name: fullName });
            toast({ title: "Registration Successful", description: "Please login now.", status: "success" });
            setTimeout(() => window.location.href = '/login', 1500);
        } catch (error) {
            toast({ title: "Registration Failed", description: "Email might be taken.", status: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box minH="100vh" w="100vw" bg="black" color="white" display="flex" alignItems="center" justifyContent="center" position="fixed" top="0" left="0" zIndex="9999">
            <Container maxW="md" bg="gray.900" p={8} borderRadius="xl" border="1px solid #333" boxShadow="2xl">
                <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                    <Heading size="lg" letterSpacing="tight">Create Account</Heading>
                    <FormControl>
                        <FormLabel color="gray.400">Full Name</FormLabel>
                        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required bg="black" border="1px solid #333" _focus={{ borderColor: '#E53E3E' }} />
                    </FormControl>
                    <FormControl>
                        <FormLabel color="gray.400">Email</FormLabel>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required bg="black" border="1px solid #333" _focus={{ borderColor: '#E53E3E' }} />
                    </FormControl>
                    <FormControl>
                        <FormLabel color="gray.400">Password</FormLabel>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required bg="black" border="1px solid #333" _focus={{ borderColor: '#E53E3E' }} />
                    </FormControl>
                    <Button type="submit" colorScheme="red" w="full" isLoading={loading} size="lg" fontSize="md">REGISTER</Button>
                    <Text fontSize="sm" color="gray.500">
                        Already have an account? <a href="/login" style={{ color: '#E53E3E' }}>Login</a>
                    </Text>
                </VStack>
            </Container>
        </Box>
    );
};
