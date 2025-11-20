'use client';
import { closestCenter, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Gift } from 'lucide-react';
import { useEffect, useState } from 'react';
import { graphql, useMutation, usePaginationFragment } from 'react-relay';
import type { EmployeeBenefitsListFragment$key } from '@/__generated__/EmployeeBenefitsListFragment.graphql';
import type { EmployeeBenefitsListPaginationQuery } from '@/__generated__/EmployeeBenefitsListPaginationQuery.graphql';
import type { EmployeeBenefitsListReorderMutation } from '@/__generated__/EmployeeBenefitsListReorderMutation.graphql';
import CreateEmployeeBenefitModal from './CreateEmployeeBenefitModal';
import EmployeeBenefitCard from './EmployeeBenefitCard';

const EmployeeBenefitsListFragment = graphql`
  fragment EmployeeBenefitsListFragment on Organization
  @refetchable(queryName: "EmployeeBenefitsListPaginationQuery")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 100 }
    after: { type: "ID" }
  ) {
	id
    employeeBenefits(first: $first, after: $after) @connection(key: "EmployeeBenefitsListFragment_employeeBenefits") {
		__id
		edges {
			node {
				id
				...EmployeeBenefitCardFragment
			}
		}
    }
	...CreateEmployeeBenefitModalFragment
  }
`;

const ReorderMutation = graphql`
mutation EmployeeBenefitsListReorderMutation($organizationId: ID!, $benefitIds: [ID!]!) {
	reorderEmployeeBenefits(organizationId: $organizationId, benefitIds: $benefitIds) {
		__typename
		... on ReorderEmployeeBenefitsSuccess {
			employeeBenefits {
				id
				order
			}
		}
	}
}
`;

export default function EmployeeBenefitsList({
	rootQuery,
	isOpen,
	onOpenChange,
	onClose
}: {
	rootQuery: EmployeeBenefitsListFragment$key;
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}) {
	const { data } = usePaginationFragment<EmployeeBenefitsListPaginationQuery, EmployeeBenefitsListFragment$key>(
		EmployeeBenefitsListFragment,
		rootQuery
	);
	const [benefits, setBenefits] = useState(data.employeeBenefits?.edges?.map(edge => edge.node).filter(Boolean) ?? []);

	useEffect(() => {
		setBenefits(data.employeeBenefits?.edges?.map(edge => edge.node).filter(Boolean) ?? []);
	}, [data.employeeBenefits?.edges]);
	const [commitReorder] = useMutation<EmployeeBenefitsListReorderMutation>(ReorderMutation);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8
			}
		})
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = benefits.findIndex(b => b.id === active.id);
			const newIndex = benefits.findIndex(b => b.id === over.id);
			const newBenefits = arrayMove(benefits, oldIndex, newIndex);
			setBenefits(newBenefits);

			commitReorder({
				variables: {
					organizationId: data.id,
					benefitIds: newBenefits.map(b => b.id)
				}
			});
		}
	}

	if (!benefits || benefits.length === 0) {
		return (
			<>
				<div className='w-full flex flex-col items-center justify-center gap-8 border-dashed border-foreground-300 border-2 rounded-lg py-8'>
					<div className='p-4 rounded-full bg-primary/10'>
						<Gift className='w-8 h-8 text-primary' />
					</div>
					<div className='flex flex-col items-center gap-4'>
						<h3 className='font-medium text-lg'>No employee benefits added yet</h3>
						<p className='text-foreground-500 text-sm'>Click "Add Benefit" to get started</p>
					</div>
				</div>

				<CreateEmployeeBenefitModal
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					onClose={onClose}
					connectionId={data.employeeBenefits.__id}
					organization={data}
				/>
			</>
		);
	}

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			>
				<SortableContext items={benefits.map(b => b.id)} strategy={verticalListSortingStrategy}>
					<div className='w-full flex flex-col gap-4'>
						{benefits.map(benefit => (
							<EmployeeBenefitCard connectionId={data.employeeBenefits.__id} key={benefit.id} benefit={benefit} organizationId={data.id} />
						))}
					</div>
				</SortableContext>
			</DndContext>
			{data.employeeBenefits?.__id && (
				<CreateEmployeeBenefitModal
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					onClose={onClose}
					connectionId={data.employeeBenefits.__id}
					organization={data}
				/>
			)}
		</>
	);
}
