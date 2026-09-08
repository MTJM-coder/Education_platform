# Spécification des endpoints API — Education Platform

Convention : REST, JSON, authentification par JWT (Bearer token). Toutes les routes sauf `/auth/*` nécessitent un token valide. La colonne "Rôle(s)" indique qui peut appeler l'endpoint (au-delà du Super Admin, qui a accès à tout).

---

## 1. Authentification & compte

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| POST | `/auth/register/parent` | Inscription parent | Public |
| POST | `/auth/register/teacher` | Inscription enseignant (profil + documents) | Public |
| POST | `/auth/register/student` | Inscription élève auto-inscrit (`Learner.type=self`) | Public |
| POST | `/auth/login` | Connexion (email/tél + mot de passe) | Public |
| POST | `/auth/logout` | Déconnexion | Tous |
| POST | `/auth/refresh-token` | Rafraîchir le token JWT | Tous |
| POST | `/auth/forgot-password` | Demande de réinitialisation | Public |
| POST | `/auth/reset-password` | Réinitialisation avec code/token | Public |
| GET | `/me` | Profil de l'utilisateur connecté | Tous |
| PATCH | `/me` | Modifier son propre profil | Tous |

---

## 2. Gestion des utilisateurs (Admin)

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| GET | `/admin/users` | Liste des utilisateurs (filtrable par rôle) | Super Admin, Admin Staff |
| GET | `/admin/users/{id}` | Détail d'un utilisateur | Super Admin, Admin Staff |
| PATCH | `/admin/users/{id}/status` | Activer/suspendre un compte | Super Admin |
| DELETE | `/admin/users/{id}` | Supprimer un compte | Super Admin |

---

## 3. Enseignants — profil, validation, matières

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| GET | `/teachers` | Rechercher/lister des enseignants (filtres : matière, niveau, classe, localisation, disponibilité) | Admin, Parent (résultats filtrés) |
| GET | `/teachers/{id}` | Détail d'un enseignant | Tous |
| PATCH | `/teachers/{id}` | Modifier son profil enseignant | Teacher (soi-même), Admin |
| POST | `/teachers/{id}/documents` | Téléverser un document (CV, diplôme, pièce d'identité...) | Teacher (soi-même) |
| PATCH | `/teachers/{id}/validate` | Valider/rejeter le profil enseignant | Super Admin, Admin Staff |
| GET | `/teachers/{id}/subjects` | Matières/classes enseignées et leur statut de validation | Tous |
| POST | `/teachers/{id}/subjects` | Ajouter une matière enseignée (à valider) | Teacher (soi-même) |
| PATCH | `/teachers/{id}/subjects/{subjectId}/validate` | Valider une matière pour cet enseignant | HOD de la matière |
| GET | `/teachers/{id}/availability` | Consulter les disponibilités | Tous |
| PUT | `/teachers/{id}/availability` | Définir/mettre à jour les créneaux disponibles | Teacher (soi-même) |
| GET | `/teachers/{id}/balance` | Solde et revenus | Teacher (soi-même), Admin |
| GET | `/teachers/{id}/statistics` | Statistiques (note moyenne, nb élèves, assiduité...) | Tous |

---

## 4. Heads of Department (HOD)

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| GET | `/departments` | Liste des matières et leur HOD actuel | Tous |
| POST | `/departments/{subjectId}/head` | Nommer un enseignant HOD de cette matière | Super Admin |
| DELETE | `/departments/{subjectId}/head` | Retirer le HOD actuel (désactivation) | Super Admin |
| GET | `/departments/{subjectId}/teachers` | Enseignants rattachés à cette matière | HOD, Admin |

---

## 5. Parents & Learners (élèves/enfants)

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| GET | `/parents/{id}/learners` | Enfants gérés par ce parent | Parent (soi-même), Admin |
| POST | `/parents/{id}/learners` | Ajouter un enfant (`Learner.type=child`) | Parent (soi-même) |
| GET | `/learners/{id}` | Profil d'un learner | Parent lié, Teacher assigné, Admin, Learner (soi-même si self) |
| PATCH | `/learners/{id}` | Modifier le profil pédagogique (section, niveau, classe...) | Parent lié, Learner (soi-même si self), Admin |
| GET | `/learners/{id}/results` | Résultats académiques du learner | Parent lié, Learner (soi-même), Teacher assigné, HOD, Admin |
| GET | `/learners/{id}/statistics` | Statistiques (moyenne, progression, assiduité) | Parent lié, Learner (soi-même), Admin |

---

## 6. Matières, niveaux, classes (référentiel)

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| GET | `/subjects` | Liste des matières | Tous |
| POST | `/subjects` | Créer une matière | Super Admin |
| GET | `/levels` | Liste des niveaux | Tous |
| POST | `/levels` | Créer un niveau | Super Admin |
| GET | `/levels/{id}/classes` | Classes d'un niveau | Tous |
| POST | `/levels/{id}/classes` | Créer une classe | Super Admin |

---

## 7. Demande de tutorat & matching

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| POST | `/tutoring-requests` | Créer une demande de cours (learnerId, matière, localisation, dispo) | Parent, Learner (self) |
| GET | `/tutoring-requests` | Lister ses demandes | Parent (soi-même), Learner (soi-même), Admin |
| GET | `/tutoring-requests/{id}` | Détail d'une demande | Concernés, Admin |
| GET | `/tutoring-requests/{id}/matches` | Enseignants recommandés (matching automatique) | Parent lié, Learner lié, Admin |
| PATCH | `/tutoring-requests/{id}/cancel` | Annuler la demande | Parent lié, Learner lié, Admin |

---

## 8. Affectations (Assignments)

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| POST | `/tutoring-requests/{id}/assignments` | Sélectionner/demander un enseignant recommandé | Parent lié, Learner lié |
| GET | `/assignments/{id}` | Détail d'une affectation | Parties concernées, Admin |
| PATCH | `/assignments/{id}/validate` | Valider l'affectation finale | Super Admin, Admin Staff |
| PATCH | `/assignments/{id}/price` | Convenir/valider le prix final | Admin |
| PATCH | `/assignments/{id}/cancel` | Annuler une affectation | Parties concernées, Admin |
| GET | `/teachers/{id}/assignments` | Affectations d'un enseignant | Teacher (soi-même), Admin |

---

## 9. Sessions (séances)

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| POST | `/assignments/{id}/sessions` | Planifier une séance | Teacher, Admin |
| GET | `/assignments/{id}/sessions` | Liste des séances d'une affectation | Parties concernées, Admin |
| PATCH | `/sessions/{id}/status` | Mettre à jour le statut (Completed/Cancelled) | Teacher, Parent/Learner (confirmation) |
| POST | `/sessions/{id}/confirm` | Confirmer qu'une séance a bien eu lieu | Parent lié, Learner lié |

---

## 10. Paiement & séquestre

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| POST | `/assignments/{id}/payments` | Initier un paiement (Mobile Money / virement) | Parent lié |
| GET | `/payments/{id}` | Détail d'un paiement | Parties concernées, Admin |
| GET | `/payments/{id}/status` | Statut du paiement (webhook-friendly) | Parties concernées, Admin |
| POST | `/payments/webhook/mobile-money` | Callback du fournisseur Mobile Money | Système (interne) |
| PATCH | `/payments/{id}/release` | Libérer les fonds séquestrés vers l'enseignant | Système (auto) / Admin |
| PATCH | `/payments/{id}/refund` | Rembourser le parent (ex. enseignant absent) | Système (auto) / Admin |
| GET | `/parents/{id}/payments` | Historique des paiements d'un parent | Parent (soi-même), Admin |
| GET | `/teachers/{id}/payments` | Historique des paiements reçus | Teacher (soi-même), Admin |
| GET | `/admin/commissions` | Suivi des commissions perçues | Super Admin |
| PATCH | `/admin/settings/commission-rate` | Configurer le taux de commission | Super Admin |

---

## 11. Litiges (Disputes)

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| POST | `/sessions/{id}/dispute` | Ouvrir un litige | Parent lié, Teacher lié |
| GET | `/disputes` | Liste des litiges (filtrable par statut) | Super Admin, Admin Staff |
| GET | `/disputes/{id}` | Détail d'un litige | Parties concernées, Admin |
| PATCH | `/disputes/{id}/resolve` | Trancher le litige (remboursement/libération) | Super Admin, Admin Staff |

---

## 12. Évaluations académiques & résultats

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| POST | `/subjects/{id}/evaluations` | Créer une évaluation académique | HOD de la matière |
| GET | `/evaluations/{id}` | Détail d'une évaluation | HOD, Teacher assigné, Admin |
| POST | `/evaluations/{id}/questions` | Ajouter des questions | HOD de la matière |
| GET | `/evaluations/{id}/questions` | Consulter les questions | Teacher assigné, HOD, Admin |
| POST | `/evaluations/{id}/results` | Saisir un résultat pour un learner | Teacher assigné |
| GET | `/evaluations/{id}/results` | Résultats de l'évaluation | HOD, Admin |

---

## 13. Évaluation des enseignants (Reviews)

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| POST | `/sessions/{id}/review` | Évaluer l'enseignant après une séance | Parent lié, Learner lié |
| GET | `/teachers/{id}/reviews` | Avis reçus par un enseignant | Tous |

---

## 14. Classement & récompenses

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| GET | `/teachers/{id}/ranking` | Rang, points, éligibilité à la promotion | Teacher (soi-même), Admin |
| PATCH | `/teachers/{id}/promote` | Valider une promotion (ex. vers Admin Staff) | Super Admin |
| GET | `/awards/monthly` | Palmarès du mois (Teacher/Student/Most Progressive) | Tous |
| POST | `/awards/monthly/compute` | Déclencher le calcul mensuel des récompenses | Système (cron) / Super Admin |
| GET | `/awards/history` | Historique des récompenses | Tous |

---

## 15. Learning Platform — notes de cours

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| POST | `/teachers/{id}/lecture-notes` | Soumettre une note de cours | Teacher (soi-même) |
| GET | `/lecture-notes` | Notes publiées (filtrable par matière/niveau) | Learner, Parent, Admin |
| GET | `/lecture-notes/pending` | Notes en attente de validation | HOD concerné |
| PATCH | `/lecture-notes/{id}/validate` | Valider/rejeter une note | HOD de la matière |

---

## 16. Concours (Competitive Exams)

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| GET | `/exams` | Liste des concours disponibles | Tous |
| POST | `/exams` | Créer un concours | Super Admin |
| GET | `/exams/{id}` | Détail d'un concours (matières, ressources, anciennes épreuves) | Tous |
| POST | `/exams/{id}/enroll` | Inscrire un learner à une préparation | Parent lié, Learner lié |
| GET | `/exams/{id}/teachers` | Enseignants spécialisés disponibles | Tous |
| GET | `/learners/{id}/exam-tracks` | Préparations concours suivies par un learner | Parent lié, Learner (soi-même), Admin |

---

## 17. Permissions (Admin Staff)

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| GET | `/permissions` | Catalogue des permissions disponibles | Super Admin |
| POST | `/permissions` | Créer une nouvelle permission | Super Admin |
| GET | `/admin/{userId}/permissions` | Permissions accordées à un Admin Staff | Super Admin |
| PUT | `/admin/{userId}/permissions` | Définir les permissions d'un Admin Staff | Super Admin |

---

## 18. Notifications

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| GET | `/me/notifications` | Mes notifications | Tous |
| PATCH | `/me/notifications/{id}/read` | Marquer comme lue | Tous |
| PATCH | `/me/notifications/read-all` | Tout marquer comme lu | Tous |

---

## 19. Statistiques globales (Admin)

| Méthode | Endpoint | Description | Rôle(s) |
|---|---|---|---|
| GET | `/admin/statistics/overview` | Nombre d'enseignants/élèves, sessions actives, paiements, commissions | Super Admin |
| GET | `/admin/statistics/trends` | Tendances mensuelles | Super Admin |

---

## Notes d'implémentation

- **Matching automatique** (`GET /tutoring-requests/{id}/matches`) : implémente l'ordre de critères validé — section → niveau → classe → matière → localisation → disponibilité → qualifications.
- **Séquestre** : `POST /payments/webhook/mobile-money` déclenche le passage `escrow_status: held`, puis soit `PATCH /payments/{id}/release` (confirmation ou 24–48h sans litige), soit `PATCH /payments/{id}/refund` (enseignant absent, litige tranché en faveur du parent).
- **Règles métier non représentées en base** (à appliquer côté application, pas en contrainte SQL) : seul un Teacher ayant un enregistrement actif dans `department_heads` pour la matière concernée peut appeler `PATCH /teachers/{id}/subjects/{subjectId}/validate`, `POST /subjects/{id}/evaluations`, ou `PATCH /lecture-notes/{id}/validate`.
