import {
    Box,
    Flex,
    Heading,
    Button,
    IconButton,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    VStack,
    Link,
    Container
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        onClose();
    };

    const handleLogin = () => {
        navigate('/login');
        onClose();
    };

    const NavLinks = () => (
        <>
            <Link href="#features" color="gray.300" _hover={{ color: '#E53E3E' }} fontWeight="medium">Features</Link>
            <Link href="#stats" color="gray.300" _hover={{ color: '#E53E3E' }} fontWeight="medium">Stats</Link>
            {isAuthenticated ? (
                <Button
                    variant="outline"
                    colorScheme="red"
                    size="sm"
                    onClick={handleLogout}
                    borderColor="red.500"
                    color="red.500"
                    _hover={{ bg: 'red.900' }}
                >
                    LOGOUT
                </Button>
            ) : (
                <Button
                    colorScheme="red"
                    bg="#E53E3E"
                    size="sm"
                    onClick={handleLogin}
                    _hover={{ bg: 'red.600' }}
                >
                    LOGIN
                </Button>
            )}
        </>
    );

    return (
        <Box bg="black" borderBottom="1px solid #333" position="sticky" top={0} zIndex={100}>
            <Container maxW="container.xl">
                <Flex alignItems="center" justifyContent="space-between" h={16}>
                    {/* Logo */}
                    <Heading size="md" color="white" cursor="pointer" onClick={() => navigate('/')}>
                        RISK<span style={{ color: '#E53E3E' }}>.AI</span>
                    </Heading>

                    {/* Desktop Menu */}
                    <Flex display={{ base: 'none', md: 'flex' }} alignItems="center" gap={8}>
                        <NavLinks />
                    </Flex>

                    {/* Mobile Menu Button */}
                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        aria-label="Open menu"
                        icon={<HamburgerIcon />}
                        variant="ghost"
                        color="white"
                        onClick={onOpen}
                        fontSize="2xl"
                    />
                </Flex>
            </Container>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay backdropFilter="blur(5px)" />
                <DrawerContent bg="black" borderLeft="1px solid #333">
                    <DrawerCloseButton color="white" mt={2} />
                    <DrawerHeader borderBottom="1px solid #333">
                        <Heading size="md" color="white">MENU</Heading>
                    </DrawerHeader>
                    <DrawerBody pt={8}>
                        <VStack spacing={6} align="stretch">
                            <Link href="#features" color="gray.300" fontSize="lg" onClick={onClose}>Features</Link>
                            <Link href="#stats" color="gray.300" fontSize="lg" onClick={onClose}>Stats</Link>
                            <Box pt={4}>
                                {isAuthenticated ? (
                                    <Button w="full" variant="outline" colorScheme="red" onClick={handleLogout}>
                                        LOGOUT
                                    </Button>
                                ) : (
                                    <Button w="full" colorScheme="red" bg="#E53E3E" onClick={handleLogin}>
                                        LOGIN
                                    </Button>
                                )}
                            </Box>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};