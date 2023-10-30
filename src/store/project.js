export default {
    state: {
        projectId: "",
    },
    mutations: {
        setProjectId(state, val) {
            state.projectId = val;
        },
        clearProjectId(state) {
            state.projectId = "";
        },
        getProjectId(state) {
            return state.projectId;
        }
    }
}