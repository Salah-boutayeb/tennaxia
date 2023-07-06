import { createStore } from 'vuex';
import httpClient from '@/common/http-commen.js';
import AuthServices from '@/service/auth/AuthServices';
import DemandeService from '@/service/fms/DemandeService';
import PropositionService from '@/service/fms/PropositionService';
import SessionService from '@/service/fms/SessionService';
import FactureService from '../service/fms/FactureService';
import MissionService from '../service/fms/MissionService';
import ParticipantsService from '../service/fms/ParticipantsService';
import ClientService from '../service/fms/ClientService';

// Create a new store instance.

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { status: { loggedIn: true }, user } : { status: { loggedIn: false }, user: null };
const store = createStore({
    state() {
        return {
            ...initialState,
            userRole: '',
            processStat: [
                {
                    id: 1,
                    label: 'Créer',
                    disabled: false,
                    to: '/step1'
                },
                {
                    id: 2,
                    label: 'Traiter',
                    disabled: true,
                    to: '/step2'
                },
                {
                    id: 3,
                    label: 'Envoyer',
                    disabled: true,
                    to: '/step3'
                },
                {
                    id: 4,
                    label: 'Valider',
                    disabled: true,
                    to: '/step4'
                },
                {
                    id: 5,
                    label: 'Terminer',
                    disabled: true,
                    to: '/step5'
                }
            ],
            demandes: [],
            missions: [],
            sessions: [],
            factures: [],
            clients: [],
            propositions: [],
            selectedMission: {},
            selectedProposition: {},
            selectedDemande: {},
            client: {}
        };
    },
    actions: {
        login: ({ commit }, user) => {
            return new Promise((resolve, reject) => {
                AuthServices.login(user).then(
                    (res) => {
                        commit('loginSuccess', { user: res.user });

                        return resolve(res.user);
                    },
                    (error) => {
                        commit('loginFailure');
                        return reject(error);
                    }
                );
            });
        },
        logout: ({ commit }) => {
            commit('CLEARSTORE');
        },
        addClient: ({ commit }, { user }) => {
            return new Promise((resolve, reject) => {
                ClientService.save(user).then(
                    (res) => {
                        if (res.success) {
                            commit('SET_CLIENTS', { client: res.client });
                            resolve(res.message);
                        } else {
                            reject(res.message);
                        }
                    },
                    () => {}
                );
            });
        },
        /* demande actions */
        allDemandes: async ({ commit }) => {
            return new Promise((resolve, reject) => {
                DemandeService.getAllDemandes().then(
                    (response) => {
                        commit('SET_DEMANDES_LIST', { list: response });
                    },
                    () => {}
                );
            });
        },

        saveDemande: async ({ commit }, demande) => {
            return new Promise((resolve, reject) => {
                DemandeService.save(demande).then(
                    (res) => {
                        if (res.success) {
                            // commit('SET_MISSION', { mission: res.mission });
                            resolve(res.demande);
                        }
                    },
                    () => {}
                );
            });
        },
        getDemandeById: async ({ commit }, demandeId) => {
            DemandeService.getDemande(demandeId).then(
                (res) => {
                    commit('SET_DEMANDE', { demande: res });
                    commit('SET_PROCESS', { status_id: res.mission.status_id });
                },
                () => {}
            );
        },

        /* ends demande actions  */

        /* proposition actions start here */

        allPropositions: function ({ commit }) {
            PropositionService.getAll().then(
                (response) => {
                    commit('SET_PROPOSITIONS_LIST', { list: response });
                },
                () => {}
            );
        },

        saveProposition: async ({ commit }, proposition) => {
            PropositionService.save(proposition).then(
                (res) => {
                    commit('SET_PROPOSITIONS', { proposition: res });
                    commit('SET_PROCESS', { status_id: res.demande.mission.status_id });
                },
                () => {}
            );
        },
        getPropsitionById: async ({ commit }, propositionId) => {
            await PropositionService.getById(propositionId).then(
                (res) => {
                    commit('SET_PROPOSITION', { proposition: res });
                },
                () => {}
            );
        },
        sendProposition: async ({ commit }, { propositionId, missionId }) => {
            await PropositionService.send(propositionId, missionId).then(
                (res) => {
                    commit('SET_PROPOSITION_TO_SENT', { proposition: res.proposition });

                    commit('SET_PROCESS', { status_id: res.proposition.demande.mission.status_id });
                },
                () => {}
            );
        },
        acceptProposition: async ({ commit }, { propositionId, missionId, message }) => {
            return new Promise((resolve, reject) => {
                PropositionService.changePropositionStat(propositionId, missionId, message).then(
                    (res) => {
                        if (res.success) {
                            commit('SET_PROPOSITION_TO_ACCEPTED', { proposition: res.proposition });
                            console.log('acceptée', res.proposition);
                            commit('SET_PROCESS', { status_id: res.proposition.demande.mission.status_id });
                            resolve(res.message);
                        }
                    },
                    () => {}
                );
            });
        },
        refuserProposition: async ({ commit }, { propositionId, missionId, message }) => {
            return new Promise((resolve, reject) => {
                PropositionService.changePropositionStat(propositionId, missionId, message).then(
                    (res) => {
                        if (res.success) {
                            console.log(res.proposition);
                            commit('SET_PROPOSITION_TO_REJECTED', { proposition: res.proposition });

                            resolve(res.message);
                        }
                    },
                    () => {}
                );
            });
        },
        updateProposition: async ({ commit }, { propositionId, proposition }) => {
            return new Promise((resolve, reject) => {
                PropositionService.update(proposition, propositionId).then(
                    (res) => {
                        if (res.success) {
                            commit('SET_PROPOSITIONS_LIST', { proposition: res.proposition });

                            commit('SET_PROCESS', { status_id: res.proposition.demande.mission.status_id });

                            resolve(res.message);
                        }
                    },
                    () => {}
                );
            });
        },
        deleteProposition: async ({ commit }, { propositionId }) => {
            return new Promise((resolve, reject) => {
                PropositionService.delete(propositionId).then(
                    (res) => {
                        if (res.success) {
                            commit('DELETE_PROPOSITION_FROM_LIST', { propositionId });
                            resolve(res.message);
                        }
                    },
                    () => {}
                );
            });
        },
        /* end here */
        /* session actions start here */
        allSessionsOfProposition: async ({ commit }) => {
            SessionService.getAll().then(
                (response) => {
                    // commit('SET_SET_SESSIONS', { list: response });
                },
                () => {}
            );
        },

        saveSessions: async ({ commit }, proposition) => {
            SessionService.save(proposition).then(
                (res) => {
                    commit('SET_SESSIONS', { session: res });
                },
                () => {}
            );
        },
        updateSession: async ({ commit }, { session, sessionId }) => {
            return new Promise((resolve, reject) => {
                SessionService.update(session, sessionId)
                    .then((res) => {
                        commit('SET_SESSION', { session: res.session });

                        resolve(res.message); // return response data to calling function
                    })
                    .catch((error) => {
                        // request failed
                        reject(error); // return error to calling function
                    });
            });
        },
        deleteSession: async ({ commit }, { sessionId }) => {
            return new Promise((resolve, reject) => {
                SessionService.delete(sessionId).then(
                    (res) => {
                        if (res.success) {
                            commit('DELETE_SESSION_FROM_LIST', { sessionId });
                            resolve(res.message);
                        }
                    },
                    () => {}
                );
            });
        },
        ConvoquerSessionParticipants: async ({ commit }, { sessionId }) => {
            return new Promise((resolve, reject) => {
                SessionService.convoquerPartcipants(sessionId).then(
                    (res) => {
                        if (res.success) {
                            console.log(res.emails);
                        }
                    },
                    () => {}
                );
            });
        },
        certifGeneration: async ({ commit }, { sessionId }) => {
            return new Promise((resolve, reject) => {
                SessionService.certifGeneration(sessionId).then(
                    (res) => {
                        if (res.success) {
                            commit('SET_SESSION_PARTICIPANTS', { sessionId, participants: res.participants });
                            resolve(res.message);
                        }
                    },
                    () => {}
                );
            });
        },
        emargementGeneration: async ({ commit }, { sessionId }) => {
            return new Promise((resolve, reject) => {
                SessionService.emargementGeneration(sessionId).then(
                    (res) => {
                        if (res.success) {
                            // commit('SET_SESSION_PARTICIPANTS', { sessionId, participants: res.participants });
                            resolve(res.message);
                        }
                    },
                    () => {}
                );
            });
        },
        /* end here */

        /*  facture actions start here */
        saveFacture: ({ commit }, facture) => {
            return new Promise((resolve, reject) => {
                FactureService.save(facture)
                    .then((res) => {
                        if (res.success) {
                            commit('SET_FACTURES_LIST', { facture: res.facture });
                        } else {
                            resolve(res.message);
                        }
                        resolve('facture est créée');
                    })

                    .catch(() => {
                        reject();
                    });
            });
        },
        updateFacture: async ({ commit }, { facture, factureId }) => {
            return new Promise((resolve, reject) => {
                FactureService.update(factureId, facture)
                    .then((res) => {
                        console.log(res);
                        commit('SET_FACTURE', { facture: res });
                        resolve(res.message);
                    })
                    .catch(() => {});
            });
        },
        deleteFactureClient: async ({ commit }, { factureId }) => {
            return new Promise((resolve, reject) => {
                FactureService.delete(factureId)
                    .then((res) => {
                        if (res.success) {
                            commit('DELETE_FACTURE_CLIENT', { factureId });
                            resolve(res.message);
                        }
                    })
                    .catch(() => {});
            });
        },
        deleteFactureFournisseur: async ({ commit }, { factureId }) => {
            return new Promise((resolve, reject) => {
                FactureService.delete(factureId)
                    .then((res) => {
                        if (res.success) {
                            commit('DELETE_FACTURE_FOURNISSEUR', { factureId });
                            resolve(res.message);
                        }
                    })
                    .catch(() => {});
            });
        },
        allFactures: async ({ commit }) => {
            return new Promise((resolve, reject) => {
                FactureService.getAll()
                    .then((res) => {
                        if (res.success) {
                            console.log(res.factures);
                            commit('SET_FACTURES', { factures: res.factures });
                        }
                    })
                    .catch(() => {});
            });
        },
        /* end here */

        /* mission actions start here */
        allMissions: ({ commit }) => {
            httpClient.get('/missions').then(
                (response) => {
                    commit('SET_MISSIONS_LIST', { list: response.data });
                },
                (err) => {
                    console.error(err);
                }
            );
        },

        deleteMissionFile: async ({ commit }, { file }) => {
            return new Promise((resolve, reject) => {
                MissionService.deleteDocument(file.id)
                    .then((res) => {
                        console.log(res);
                        // request succeeded
                        if (res.success) {
                            if (file.ref.type === 'emargement') {
                                commit('SET_EMARGEMENT');
                            } else if (file.ref.type === 'evaluation') {
                                commit('SET_EVALUATION');
                            } else if (file.ref.type === 'contrat') {
                                commit('SET_CONTRAT');
                            } else {
                                commit('SET_CONVENTION');
                            }
                        }
                        resolve(res.message); // return response data to calling function
                    })
                    .catch((error) => {
                        // request failed
                        reject(error); // return error to calling function
                    });
            });
        },
        uploadMissionFiles: async ({ commit }, { file, missionId }) => {
            return new Promise((resolve, reject) => {
                MissionService.update(file, missionId)
                    .then((response) => {
                        // request succeeded
                        commit('SET_MISSION', { mission: response.mission });
                        resolve(response.message); // return response data to calling function
                    })
                    .catch((error) => {
                        // request failed
                        reject(error); // return error to calling function
                    });
            });
        },
        terminerMission({ commit }, { missionId }) {
            console.log(missionId);
            return new Promise((resolve, reject) => {
                MissionService.update_stat(missionId)
                    .then((response) => {
                        console.log('response: ', response);
                        if (response.success) {
                            commit('SET_PROCESS', { status_id: response.mission.status_id });
                            commit('SET_MISSION', { mission: response.mission });
                            resolve(response); // return response data to calling function
                        }
                    })
                    .catch((error) => {
                        // request failed
                        reject(error); // return error to calling function
                    });
            });
        },
        /* mission actions end here */
        allClients: ({ commit }) => {
            httpClient.get('/clients').then(
                (response) => {
                    commit('SET_CLIENTS_LIST', { list: response.data });
                },
                () => {}
            );
        },
        allSessions: function ({ commit }) {
            httpClient.get('/sessions').then(
                (response) => {
                    commit('SET_SESSIONS_LIST', { list: response.data });
                },
                () => {}
            );
        },

        /* participants actions */
        saveParticipants({ commit }, { participants, sessionId }) {
            return new Promise((resolve, reject) => {
                ParticipantsService.saveParticipants(participants, sessionId)
                    .then((response) => {
                        // request succeeded
                        commit('SET_PARTICIPANTS_LIST', { data: response.participants, sessionId: sessionId });
                        resolve(response.message); // return response data to calling function
                    })
                    .catch((error) => {
                        // request failed
                        reject(error); // return error to calling function
                    });
            });
        },
        saveParticipant({ commit }, { participant }) {
            return new Promise((resolve, reject) => {
                ParticipantsService.save(participant)
                    .then((response) => {
                        // request succeeded
                        commit('SET_PARTICIPANTS_LIST', { data: response.participant });
                        resolve(response.message); // return response data to calling function
                    })
                    .catch((error) => {
                        // request failed
                        reject(error); // return error to calling function
                    });
            });
        },
        deleteParticipant({ commit }, { participantId, sessionId }) {
            return new Promise((resolve, reject) => {
                ParticipantsService.delete(participantId)
                    .then((response) => {
                        // request succeeded
                        commit('DELETE_PARTICIPANT', { participantId, sessionId });
                        resolve(response); // return response data to calling function
                    })
                    .catch((error) => {
                        // request failed
                        reject(error); // return error to calling function
                    });
            });
        },
        updateParticipant({ commit }, { participant }) {
            return new Promise((resolve, reject) => {
                ParticipantsService.update(participant.id, participant)
                    .then((response) => {
                        // request succeeded
                        commit('UPDATE_PARTICIPANT', { participant: response.participant });
                        resolve(response); // return response data to calling function
                    })
                    .catch((error) => {
                        // request failed
                        reject(error); // return error to calling function
                    });
            });
        }

        /* ************************** */
    },
    mutations: {
        loginSuccess(state, { user }) {
            state.status.loggedIn = true;
            state.user = user;
            state.userRole = user.roles.length > 0 ? user.roles[0].name : 'gestionnaire';
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        CLEARSTORE: (state) => {
            console.log('logout');
            state.status.loggedIn = false;
            state.user = null;
            state.userRole = '';
            state.processStat = [
                {
                    id: 1,
                    label: 'Créer',
                    disabled: false,
                    to: '/step1'
                },
                {
                    id: 2,
                    label: 'Traiter',
                    disabled: true,
                    to: '/step2'
                },
                {
                    id: 3,
                    label: 'Envoyer',
                    disabled: true,
                    to: '/step3'
                },
                {
                    id: 4,
                    label: 'Valider',
                    disabled: true,
                    to: '/step4'
                },
                {
                    id: 5,
                    label: 'Terminer',
                    disabled: true,
                    to: '/step5'
                }
            ];
            state.demandes = [];
            state.missions = [];
            state.sessions = [];
            state.factures = [];
            state.clients = [];
            state.propositions = [];
            state.selectedMission = {};
            state.selectedProposition = {};
            state.selectedDemande = {};
            state.client = {};
        },

        SET_DEMANDES_LIST: (state, { list }) => {
            state.demandes = list;
        },
        SET_CLIENTS_LIST: (state, { list }) => {
            state.clients = list;
        },
        SET_CLIENTS: (state, { client }) => {
            state.clients.push(client);
        },
        SET_MISSIONS_LIST: (state, { list }) => {
            state.missions = list;
        },
        SET_MISSION: (state, { mission }) => {
            state.selectedMission = mission;
        },

        SET_DEMANDE: (state, { demande }) => {
            state.selectedDemande = demande;
            state.client = demande.client;
            state.selectedMission = demande.mission;
            state.selectedMission.emargement = demande.emargement;
            state.selectedMission.contrat = demande.contrat;
            state.selectedMission.evaluation = demande.evaluation;
            state.selectedMission.convention = demande.convention;

            state.propositions = demande.propositions.map((proposition) => {
                return {
                    ...proposition,
                    demande: state.selectedDemande,
                    client: state.client
                };
            });
        },
        SET_PROPOSITIONS: (state, { proposition }) => {
            state.propositions.push(proposition);
        },
        SET_PROPOSITION: (state, { proposition }) => {
            state.selectedProposition = proposition;
            state.sessions = proposition.demande.mission.sessions;
        },
        SET_PROPOSITIONS_LIST: (state, { proposition }) => {
            state.propositions = state.propositions.map((element) => {
                return element.id == proposition.id ? proposition : element;
            });
        },
        DELETE_PROPOSITION_FROM_LIST: (state, { propositionId }) => {
            state.propositions = state.propositions.filter((element) => {
                return element.id != propositionId;
            });
        },
        SET_PROPOSITION_TO_SENT: (state, { proposition }) => {
            state.propositions = state.propositions.map((prop) => {
                if (prop.id === proposition.id) {
                    prop.is_sent = true;
                    prop.etat = 'shorlistée';
                    state.selectedProposition = prop;
                    return prop;
                }
            });
            state.selectedMission = proposition.demande.mission;
        },
        SET_PROPOSITION_TO_ACCEPTED: (state, { proposition }) => {
            state.propositions = state.propositions.map((prop) => {
                if (prop.id === proposition.id) {
                    prop = proposition;
                    state.selectedProposition = proposition;
                    state.selectedDemande = proposition.demande;
                }
                return prop;
            });
            state.selectedMission = proposition.demande.mission;
        },
        SET_PROPOSITION_TO_REJECTED: (state, { proposition }) => {
            console.log(proposition);
            state.selectedProposition = proposition;
            state.propositions = state.propositions.map((prop) => {
                if (prop.id === proposition.id) {
                    prop = proposition;
                }
                return prop;
            });
            state.selectedMission = proposition.demande.mission;
        },
        SET_SESSIONS: (state, { session }) => {
            session.etat = 'créée';

            state.sessions.push(session);
        },
        SET_SESSION: (state, { session }) => {
            state.sessions = state.sessions.map((element) => {
                return element.id == session.id ? session : element;
            });
        },
        DELETE_SESSION_FROM_LIST: (state, { sessionId }) => {
            state.sessions = state.sessions.filter((element) => {
                return element.id != sessionId;
            });
        },
        SET_SESSION_PARTICIPANTS: (state, { sessionId, participants }) => {
            state.sessions = state.sessions.map((session) => {
                if (session.id == sessionId) {
                    session.participants = participants;
                }
                return session;
            });
        },
        SET_FACTURES: (state, { factures }) => {
            state.factures = factures;
        },
        SET_FACTURES_LIST: (state, { facture }) => {
            if (facture.type === 'client') {
                state.selectedDemande.facture_client = facture;
            } else {
                state.selectedDemande.facture_fournisseur = facture;
            }
            state.selectedDemande.mission.factures.push(facture);
        },
        SET_FACTURE: (state, { facture }) => {
            state.factures = state.factures.map((element) => {
                return element.id === facture.id ? facture : element;
            });
            // state.selectedDemande.mission.factures = state.selectedDemande.mission.factures.map((element) => {
            //     return element.id === facture.id ? facture : element;
            // });
        },
        DELETE_FACTURE_CLIENT: (state, { factureId }) => {
            state.selectedDemande.facture_client = null;
            state.selectedDemande.mission.factures = state.selectedDemande.mission.factures.filter((element) => element.id !== factureId);
        },
        DELETE_FACTURE_FOURNISSEUR: (state, { factureId }) => {
            state.selectedDemande.facture_fournisseur = null;
            state.selectedDemande.mission.factures = state.selectedDemande.mission.factures.filter((element) => element.id !== factureId);
        },
        SET_CONVENTION: (state) => {
            state.selectedMission.convention = null;
        },
        SET_CONTRAT: (state) => {
            state.selectedMission.contrat = null;
        },
        SET_EMARGEMENT: (state) => {
            state.selectedMission.emargement = null;
        },
        SET_EVALUATION: (state) => {
            state.selectedMission.evaluation = null;
        },

        /* participants mutations */
        SET_PARTICIPANTS_LIST: (state, { data, sessionId }) => {
            if (Array.isArray(data)) {
                state.sessions = state.sessions.map((session) => {
                    if (session.id == sessionId) {
                        session.participants = data;
                    }
                    return session;
                });
            } else {
                state.sessions = state.sessions.map((session) => {
                    if (session.id == data.session_id) {
                        session.participants.push(data);
                    }
                    return session;
                });
            }
        },
        DELETE_PARTICIPANT: (state, { participantId, sessionId }) => {
            state.sessions = state.sessions.filter((session) => {
                if (session.id == sessionId) {
                    session.participants = session.participants.filter((participant) => participant.id !== participantId);
                }
                return session;
            });
        },
        UPDATE_PARTICIPANT: (state, { participant }) => {
            state.sessions = state.sessions.filter((session) => {
                if (session.id == participant.session_id) {
                    session.participants = session.participants.map((val) => (participant.id == val.id ? participant : val));
                }
                return session;
            });
        },
        SET_PROCESS: (state, { status_id }) => {
            state.processStat = state.processStat.map((val) => {
                if (val.id <= status_id) {
                    val.disabled = false;
                }
                return val;
            });
        },
        INIT_PROCESS: (state) => {
            state.processStat = state.processStat.map((val) => {
                val.disabled = true;
                return val;
            });
        }
        /* **************************************************************** */
    },
    getters: {
        demandes: (state) => {
            return state.demandes;
        },
        countDemandes: (state) => {
            return state.demandes.length;
        },
        missions: (state) => {
            return state.missions;
        },
        countMissions: (state) => {
            return state.missions.length;
        },
        clients: (state) => {
            return state.clients;
        },
        countClients: (state) => {
            return state.clients.length;
        },
        getPropositions: (state) => {
            return state.propositions;
        }
    },
    modules: {}
});

export default store;
