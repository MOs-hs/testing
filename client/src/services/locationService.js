// Static locations for Baalbek-Hermel as per requirements, 
// can be moved to API if dynamic locations are needed in future.
// For now we serve the static list but structure it as a service/mock API 
// in case we implement the location endpoint later.

const LOCATIONS = [
    { id: 1, name_en: 'Baalbek', name_ar: 'بعلبك' },
    { id: 2, name_en: 'Hermel', name_ar: 'الهرمل' },
    { id: 3, name_en: 'Arsal', name_ar: 'عرسال' },
    { id: 4, name_en: 'Ras Baalbek', name_ar: 'رأس بعلبك' },
    { id: 5, name_en: 'Brital', name_ar: 'بريتال' },
    { id: 6, name_en: 'Deir El Ahmar', name_ar: 'دير الأحمر' },
    { id: 7, name_en: 'Labweh', name_ar: 'اللبوة' },
    { id: 8, name_en: 'Nabi Sheet', name_ar: 'النبي شيت' },
    { id: 9, name_en: 'Shmestar', name_ar: 'شمسطار' },
    { id: 10, name_en: 'Bednayel', name_ar: 'بدنايل' }
];

const locationService = {
    getAll: async () => {
        // Simulating API call for now, or could fetch from backend if endpoint exists
        return Promise.resolve(LOCATIONS);
    }
};

export default locationService;
