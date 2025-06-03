import React from 'react';
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode; // e.g., <Button>Save</Button>
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  closeOnOverlayClick?: boolean;
  isCentered?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
  size = 'md',
  closeOnOverlayClick = true,
  isCentered = true,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const headerBorderColor = useColorModeValue('gray.200', 'gray.700');
  const footerBorderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <ChakraModal 
        isOpen={isOpen} 
        onClose={onClose} 
        size={size} 
        isCentered={isCentered}
        closeOnOverlayClick={closeOnOverlayClick}
        scrollBehavior="inside" // or "outside"
    >
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(5px)"/>
      <ModalContent bg={bg} borderRadius="lg" boxShadow="2xl" mx={4}>
        <ModalHeader 
            borderBottomWidth="1px" 
            borderColor={headerBorderColor} 
            pb={4} 
            fontSize="xl" 
            fontWeight="semibold"
            color={useColorModeValue('gray.700', 'gray.100')}
        >
          {title}
        </ModalHeader>
        <ModalCloseButton 
            _focus={{ boxShadow: 'outline' }} 
            _hover={{ bg: useColorModeValue('gray.100', 'gray.700')}} 
            borderRadius="md"
        />
        <ModalBody py={6} px={6}>
          {children}
        </ModalBody>

        {footerActions && (
          <ModalFooter 
            borderTopWidth="1px" 
            borderColor={footerBorderColor} 
            pt={4}
          >
            {footerActions}
          </ModalFooter>
        )}
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
