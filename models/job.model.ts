import instance from '@/utils/axios.utils';

const job = {
    
    detail: (id: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `jobs/${id}`;
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

export default job;