<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import {
		FormControl,
		FormField,
		FormLabel,
		FieldErrors,
		FormButton
	} from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Calendar } from '$lib/components/ui/calendar';
	import { toast } from 'svelte-sonner';
	import { CalendarDays, CirclePlus } from 'lucide-svelte';
	import { type List } from '@prisma/client';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { createTaskSchema, type CreateTaskSchema } from '$lib/schema/createTask';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { ListMap } from '$lib/const';
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';

	const { checkList }: { checkList: List } = $props();
	const { id, name, color } = checkList;

	let open = $state(false);

	let data: SuperValidated<Infer<CreateTaskSchema>> = $page.data.createTaskForm;

	const form = superForm(data, {
		validators: zodClient(createTaskSchema),
		onResult({ result }) {
			if (result.type === 'success') {
				toast.success('任务创建成功！');
				open = false;
			} else {
				toast.error('任务创建失败!请稍后重试');
			}
		}
	});

	const { form: formData, enhance, submitting, reset } = form;

	const onOpenChange = (open: boolean) => {
		open = open;
		reset();
	};

	const df = new DateFormatter('zh-CN', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined = $state(undefined);

	$effect(() => {
		value = $formData.expiresAt ? parseDate($formData.expiresAt) : undefined;
	});

	let placeholder: DateValue = $state(today(getLocalTimeZone()));
</script>

<Dialog bind:open {onOpenChange}>
	<DialogTrigger asChild let:builder>
		<Button builders={[builder]} size={'icon'} variant={'ghost'}>
			<CirclePlus />
		</Button>
	</DialogTrigger>
	<DialogContent class="sm:max-w-[425px]">
		<DialogHeader>
			<DialogTitle>添加任务</DialogTitle>
			<DialogDescription>任务将添加到 「{name}」 清单</DialogDescription>
		</DialogHeader>
		<div class="grid gap-4 py-4">
			<form method="POST" action="?/addTask" use:enhance>
				<FormField {form} name="content">
					<FormControl let:attrs>
						<FormLabel>任务内容：</FormLabel>
						<Input class="col-span-3" {...attrs} bind:value={$formData.content} />
						<FieldErrors />
					</FormControl>
				</FormField>
				<FormField {form} name="expiresAt">
					<FormControl let:attrs>
						<FormLabel>截止日期：</FormLabel>
						<Popover>
							<PopoverTrigger asChild let:builder>
								<Button
									variant={'outline'}
									class={cn(
										'w-full justify-start text-left font-normal',
										!value && 'text-muted-foreground'
									)}
									builders={[builder]}
								>
									<CalendarDays class="mr-2 h-4 w-4" />
									{value ? df.format(value.toDate(getLocalTimeZone())) : '选择完成日期'}
								</Button>
							</PopoverTrigger>
							<PopoverContent>
								<Calendar
									{value}
									bind:placeholder
									initialFocus
									onValueChange={(v) => {
										if (v) {
											$formData.expiresAt = v.toString();
										} else {
											$formData.expiresAt = '';
										}
									}}
								/>
							</PopoverContent>
						</Popover>
						<FieldErrors />
						<input hidden value={$formData.expiresAt} name={attrs.name} />
						<input hidden value={id} name="listId" />
					</FormControl>
				</FormField>
				<FormButton
					disabled={$submitting}
					class={cn('mt-4 w-full text-white dark:text-white', ListMap.get(color))}
				>
					确认
				</FormButton>
			</form>
		</div>
	</DialogContent>
</Dialog>
