import { ref, onMounted } from "vue";
import axios from "axios";

export function useNotifications() {
    const notificationCount = ref(0);
    const orderRequestCount = ref(0);
    const returnRequestCount = ref(0);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/notifications/count');
            notificationCount.value = response.data.order_count + response.data.return_count;
            orderRequestCount.value = response.data.order_count;
            returnRequestCount.value = response.data.return_count;
        } catch (error) {
            console.error("Gagal mengambil jumlah notifikasi:", error);
        }
    };

    onMounted(() => {
        fetchNotifications();
        setInterval(() => {
            fetchNotifications();
        }, 30000); // Update setiap 30 detik
    });

    return { notificationCount, orderRequestCount, returnRequestCount, fetchNotifications };
}
