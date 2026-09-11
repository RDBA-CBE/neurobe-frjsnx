import instance from '@/utils/axios.utils';

const stats = {
    academic_setup: () => {
        let promise = new Promise((resolve, reject) => {
            let url = `org/stats/stats`;    
            instance()
                .get(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },
};

export default stats;