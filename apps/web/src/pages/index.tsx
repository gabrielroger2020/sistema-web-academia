// src/pages/index.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Flex,
  Heading,
  Input,
  Stack
} from '@chakra-ui/react';
import {FormControl, FormErrorMessage, FormLabel} from '@chakra-ui/form-control'
import { toaster } from "@/components/ui/toaster"
import { useAuth } from '@/contexts/AuthContext';

// Schema de validação com Zod
const loginFormSchema = z.object({
  usuario: z.string().min(1, 'O nome de usuário é obrigatório.'),
  senha: z.string().min(1, 'A senha é obrigatória.'),
});

type LoginFormInputs = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
  });

  async function handleSignIn(data: LoginFormInputs) {
    try {
      await signIn(data);
      toaster.create({
        title: 'Login realizado com sucesso!',
        type: 'success',
        duration: 3000
      });
    } catch (error: any) {
      toaster.create({
        title: 'Erro no login.',
        description: error.response?.data?.message || 'Usuário ou senha inválidos.',
        type: 'error',
        duration: 5000,
      });
    }
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        w="100%"
        maxW={360}
        bg="gray.100"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Heading size="lg" fontWeight="normal" mb="6" textAlign={'center'}>
          Faça seu login
        </Heading>

        <Stack>
          <FormControl isInvalid={!!errors.usuario}>
            <FormLabel htmlFor="usuario">Usuário</FormLabel>
            <Input
              id="usuario"
              type="text"
              bgColor="gray.200"
              _hover={{
                bgColor: 'gray.300',
              }}
              {...register('usuario')}
            />
            {errors.usuario && <FormErrorMessage>{errors.usuario.message}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.senha}>
            <FormLabel htmlFor="senha">Senha</FormLabel>
            <Input
              id="senha"
              type="password"
              bgColor="gray.200"
              _hover={{
                bgColor: 'gray.300',
              }}
              {...register('senha')}
            />
            {errors.senha && <FormErrorMessage>{errors.senha.message}</FormErrorMessage>}
          </FormControl>
        </Stack>

        <Button
          type="submit"
          mt="6"
          size="lg"
          bgColor={'gray.500'}
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  );
}