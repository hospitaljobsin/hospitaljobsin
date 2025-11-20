'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, CardBody, useDisclosure } from '@heroui/react';
import { Edit, GripVertical, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { graphql, useFragment } from 'react-relay';
import type { EmployeeBenefitCardFragment$key } from '@/__generated__/EmployeeBenefitCardFragment.graphql';
import DeleteEmployeeBenefitModal from './DeleteEmployeeBenefitModal';
import EditEmployeeBenefitModal from './EditEmployeeBenefitModal';

const EmployeeBenefitCardFragment = graphql`
  fragment EmployeeBenefitCardFragment on EmployeeBenefit {
	id
	title
	description
	posterImageUrl
	...EditEmployeeBenefitModalFragment
	...DeleteEmployeeBenefitModalFragment
  }
`;

export default function EmployeeBenefitCard({
	benefit: benefitKey,
	organizationId,
	connectionId
}: {
	benefit: EmployeeBenefitCardFragment$key;
	organizationId: string;
	connectionId: string;
}) {
	const benefit = useFragment(EmployeeBenefitCardFragment, benefitKey);
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: benefit.id });
	const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose, onOpenChange: onEditOpenChange } = useDisclosure();
	const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose, onOpenChange: onDeleteOpenChange } = useDisclosure();

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1
	};

	return (
		<>
			<Card ref={setNodeRef} style={style} fullWidth className='p-4' shadow='none'>
				<CardBody className='flex flex-row gap-4 items-start'>
					<button type='button' className='cursor-grab active:cursor-grabbing mt-1' {...attributes} {...listeners}>
						<GripVertical size={20} className='text-foreground-400' />
					</button>
					{benefit.posterImageUrl && (
						<div className='relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden'>
							<Image src={benefit.posterImageUrl} alt={benefit.title} fill className='object-cover' />
						</div>
					)}
					<div className='flex-1 flex flex-col gap-2'>
						<h3 className='text-lg font-medium'>{benefit.title}</h3>
						<p className='text-sm text-foreground-600 line-clamp-2'>{benefit.description}</p>
					</div>
					<div className='flex gap-2'>
						<Button isIconOnly size='sm' variant='light' onPress={onEditOpen}>
							<Edit size={16} />
						</Button>
						<Button isIconOnly size='sm' variant='light' onPress={onDeleteOpen}>
							<TrashIcon size={16} />
						</Button>
					</div>
				</CardBody>
			</Card>
			<EditEmployeeBenefitModal
				isOpen={isEditOpen}
				onOpenChange={onEditOpenChange}
				onClose={onEditClose}
				benefit={benefit}
				organizationId={organizationId}
			/>
			<DeleteEmployeeBenefitModal
				isOpen={isDeleteOpen}
				onOpenChange={onDeleteOpenChange}
				onClose={onDeleteClose}
				benefit={benefit}
				organizationId={organizationId}
				connectionId={connectionId}
			/>
		</>
	);
}
