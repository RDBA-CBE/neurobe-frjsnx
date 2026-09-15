import { commonInstance } from '@/utils/axios.utils';

const learning_material = {

    generate_teating_timeline: (syllabus_id,data: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `syllabi/{syllabus_id}/schedules/generate`;
            commonInstance()
                .post(url, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
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
    detail: (syllabus_id: string | number,unit: string | number,) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/syllabi/${syllabus_id}/learning-materials-workspace?unit_number=${unit}`;
            
            commonInstance()
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

export default learning_material;
