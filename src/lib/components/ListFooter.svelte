<script lang="ts">
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
  } from '$lib/components/ui/alert-dialog';
  import { enhance } from '$app/forms';
  import { Separator } from '$lib/components/ui/separator';
  import { Button } from '$lib/components/ui/button';
  import { Trash2, CirclePlus } from 'lucide-svelte';
  import { type List } from '@prisma/client';
  import { toast } from 'svelte-sonner';

  const { checkList }: { checkList: List } = $props();
  const { createdAt, id } = checkList;

  let loading = $state(false);
</script>

<Separator class="dark:bg-white" />
<footer class="flex h-[60px] w-full items-center justify-between text-sm text-white">
  <p>创建于 {createdAt?.toLocaleDateString('zh-CN')}</p>
  <div class="flex flex-row">
    <Button size={'icon'} variant={'ghost'}>
      <CirclePlus />
    </Button>
    <AlertDialog>
      <AlertDialogTrigger asChild let:builder>
        <Button builders={[builder]} size={'icon'} variant={'ghost'}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
          <AlertDialogDescription>该操作无法撤回</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <form
            method="POST"
            action="?/deleteList"
            use:enhance={() => {
              loading = true;
              return async ({ result, update }) => {
                loading = false;
                if (result.type === 'success') {
                  toast.success('清单删除成功！');
                } else {
                  console.log(result);
                  toast.error('清单删除失败！');
                }
                update();
              };
            }}
          >
            <input type="hidden" name="id" value={id} />
            <AlertDialogAction type="submit" disabled={loading}>确定</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</footer>