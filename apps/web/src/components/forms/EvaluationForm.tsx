import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Stack, Portal, createListCollection } from '@chakra-ui/react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control'
import { CreateEvaluationData, Evaluation } from '@/services/evaluations';
import { getUsers, User } from '@/services/users';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const evaluationFormSchema = z.object({
    idUsuarioAluno: z.string('Selecione um aluno.'),
    peso: z.coerce.number().positive('O peso deve ser um número positivo.'),
    altura: z.coerce.number().positive('A altura deve ser um número positivo.'),
});

interface EvaluationFormProps {
    onSubmit: (data: CreateEvaluationData) => void;
    isSubmitting: boolean;
    defaultValues?: Evaluation;
    isEditMode: boolean;
}

export function EvaluationForm({ onSubmit, isSubmitting, defaultValues, isEditMode }: EvaluationFormProps) {
    const { data: users, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['allUsersForSelect'],
        queryFn: getUsers,
    });

    const studentsCollection = useMemo(() => {
        const studentItems = users
            ?.filter((user) => user.perfil === 'aluno')
            .map((student) => ({ label: student.nome, value: student.id })) || [];

        return createListCollection({ items: studentItems });
    }, [users]);

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(evaluationFormSchema),
        defaultValues: {
            idUsuarioAluno: defaultValues?.aluno.id || '',
            peso: defaultValues?.peso || '',
            altura: defaultValues?.altura || ''
        }
    });

    return (
        <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.idUsuarioAluno}>
                <FormLabel htmlFor="idUsuarioAluno">Aluno</FormLabel>
                <Controller
                    name="idUsuarioAluno"
                    control={control}
                    render={({ field }) => (
                        <Select.Root
                            collection={studentsCollection}
                            id="idUsuarioAluno"
                            value={field.value ? [field.value] : []}
                            onValueChange={(details) => field.onChange(details.value[0])}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            disabled={isLoadingUsers}
                            readOnly={isEditMode}
                        >
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Selecione um aluno" />
                                </Select.Trigger>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content zIndex={'max'}>
                                        {studentsCollection.items.map((student) => (
                                            <Select.Item key={student.value} item={student}>
                                                <Select.ItemText>{student.label}</Select.ItemText>
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    )}
                />
                <FormErrorMessage>{errors.idUsuarioAluno?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.altura}>
                <FormLabel htmlFor="altura">Altura (Ex: 1.75)</FormLabel>
                <Input id="altura" type="number" step="0.01" {...register('altura')} />
                <FormErrorMessage>{errors.altura?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.peso}>
                <FormLabel htmlFor="peso">Peso (Ex: 70.5)</FormLabel>
                <Input id="peso" type="number" step="0.1" {...register('peso')} />
                <FormErrorMessage>{errors.peso?.message}</FormErrorMessage>
            </FormControl>
            <Button type="submit" mt="4">
                Salvar
            </Button>
        </Stack>
    );
}