// src/components/Navbar.tsx
import { Box, Flex, Heading, Button } from '@chakra-ui/react';

export const Navbar = () => {
    return (
        <Box bg="gray.900" px={4} py={3}>
            <Flex alignItems="center" justifyContent="space-between">
                <Heading size="md" color="white">
                    🏦 CreditRisk<span style={{ color: '#48BB78' }}>AI</span>
                </Heading>
                <Button size="sm" colorScheme="green">
                    Admin Login
                </Button>
            </Flex>
        </Box>
    );
};