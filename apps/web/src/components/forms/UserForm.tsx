import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Stack, Portal } from '@chakra-ui/react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control'
import { CreateUserData, UpdateUserData, User } from '@/services/users';
import { createListCollection } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

const createUserSchema = z.object({
    nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    usuario: z.string().min(3, 'O usuário deve ter no mínimo 3 caracteres.'),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    perfil: z.enum(['admin', 'professor', 'aluno'], {
        error: "Por favor, selecione um perfil."
    }),
});

const updateUserSchema = z.object({
    nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    usuario: z.string().min(3, 'O usuário deve ter no mínimo 3 caracteres.'),
    senha: z.string().min(6, 'A senha deve ter 6+ caracteres.').or(z.literal('')).optional(),
    perfil: z.enum(['admin', 'professor', 'aluno'], {
        error: 'Selecione um perfil.',
    }),
});

interface UserFormProps {
    onSubmit: (data: Partial<CreateUserData>) => void;
    isSubmitting: boolean;
    defaultValues?: Partial<User>;
    isEditMode: boolean;
    perfil?: string;
}

const profiles = createListCollection({
    items: [
        { label: "Administrador", value: "admin" },
        { label: "Professor", value: "professor" },
        { label: "Aluno", value: "aluno" },
    ],
})

export function UserForm({ onSubmit, isSubmitting, defaultValues, isEditMode, perfil }: UserFormProps) {
    const currentSchema = isEditMode ? updateUserSchema : createUserSchema;
    const { register, control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(currentSchema),
        defaultValues: {
            nome: defaultValues?.nome || '',
            usuario: defaultValues?.usuario || '',
            perfil: (perfil == 'professor') ? 'aluno' : defaultValues?.perfil ,
            senha: ''
        }
    });

    return (
        <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.nome}>
                <FormLabel htmlFor="nome">Nome completo</FormLabel>
                <Input id="nome" {...register('nome')} />
                <FormErrorMessage>{errors.nome?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.usuario}>
                <FormLabel htmlFor="usuario">Nome de usuário</FormLabel>
                <Input id="usuario" {...register('usuario')} />
                <FormErrorMessage>{errors.usuario?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.senha}>
                <FormLabel htmlFor="senha">Senha</FormLabel>
                <Input id="senha" type="password" placeholder="Deixe em branco para não alterar" {...register('senha')} />
                <FormErrorMessage>{errors.senha?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.perfil}>
                <FormLabel htmlFor="perfil">Perfil</FormLabel>
                <Controller
                    name="perfil"
                    control={control}
                    render={({ field }) => (
                        <Select.Root collection={profiles} id="perfil" onValueChange={(details) => field.onChange(details.value[0])} value={field.value ? [field.value] : []} onBlur={field.onBlur} ref={field.ref} readOnly={perfil == 'professor'}>
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Selecione o perfil" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner >
                                    <Select.Content zIndex={'max'}>
                                        {profiles.items.map((profile) => (
                                            <Select.Item item={profile} key={profile.value}>
                                                {profile.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    )} />
                <FormErrorMessage>{errors.perfil?.message}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="blue" mt="4">
                Salvar
            </Button>
        </Stack>
    );
}