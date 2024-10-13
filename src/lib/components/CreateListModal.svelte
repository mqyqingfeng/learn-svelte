<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import * as Form from '$lib/components/ui/form';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { createListSchema, type CreateListSchema } from '$lib/schema/createList';
	import { cn } from '$lib/utils';
	import { ListMap } from '$lib/const';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';

	let open = $state(false);

	let data: SuperValidated<Infer<CreateListSchema>> = $page.data.createListForm;

	const form = superForm(data, {
		validators: zodClient(createListSchema),
		onUpdated: ({ form: f }) => {
			if (!f.valid) {
				toast.error('请先检查数据');
			}
		},
		onResult({ result, cancel }) {
			if (result.type === 'success') {
				toast.success('清单创建成功！');
				open = false;
			} else {
				if ('data' in result && result.data) {
					toast.error(result.data.message);
				} else {
					toast.error('清单创建失败!');
				}
				cancel();
			}
		}
	});

	const { form: formData, enhance, submitting, reset } = form;

	const onOpenChange = (open: boolean) => {
		open = open;
		reset();
	};
</script>

<Sheet bind:open {onOpenChange}>
	<SheetTrigger asChild let:builder>
		<Button builders={[builder]}>添加清单</Button>
	</SheetTrigger>
	<SheetContent>
		<SheetHeader>
			<SheetTitle>添加清单</SheetTitle>
			<SheetDescription>清单是任务的集合，比如“工作”、“生活”、“副业”</SheetDescription>
		</SheetHeader>
		<form method="POST" action="?/addList" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>设置清单的名称：</Form.Label>
					<Input {...attrs} bind:value={$formData.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="color">
				<Form.Control let:attrs>
					<Form.Label>选择清单的背景色：</Form.Label>
					<Select
						selected={$formData.color
							? {
									value: $formData.color,
									label: ListMap.get($formData.color)![1]
								}
							: undefined}
						onSelectedChange={(v) => {
							v && ($formData.color = v.value);
						}}
					>
						<SelectTrigger
							{...attrs}
							class={cn('w-[180px]', ListMap.get($formData.color), {
								'text-white': !!attrs.name
							})}
						>
							<SelectValue placeholder="颜色" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{#each [...ListMap.entries()] as [color, [className, name]]}
									<SelectItem
										value={color}
										label={name}
										class={cn(
											'my-1 w-full rounded-md text-white ring-black hover:font-bold hover:ring-2 data-[highlighted]:text-white dark:ring-white',
											className,
											`data-[highlighted]:${className}`
										)}
									>
										{name}
									</SelectItem>
								{/each}
							</SelectGroup>
						</SelectContent>
					</Select>
					<input hidden bind:value={$formData.color} name={attrs.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button class="w-full" disabled={$submitting}>创建</Form.Button>
		</form>
	</SheetContent>
</Sheet>
