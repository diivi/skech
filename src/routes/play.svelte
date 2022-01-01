<script>
    import { goto } from '$app/navigation';
    import {v4 as uuid} from 'uuid';
    goto(`/play/${uuid()}`);
</script>
