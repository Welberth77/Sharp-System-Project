import { useAuth } from "../context/AuthContext"

// Definição das permissões por role
const ROLE_PERMISSIONS = {
  ADMIN: {
    canViewProfessors: true,
    canCreateProfessors: true,
    canEditProfessors: true,
    canDeleteProfessors: true,
    canViewStudents: true,
    canCreateStudents: true,
    canEditStudents: true,
    canDeleteStudents: true,
    canViewReports: true,
    canManageSystem: true,
  },
  COORDENADOR: {
    canViewProfessors: true,
    canCreateProfessors: true,
    canEditProfessors: true,
    canDeleteProfessors: false,
    canViewStudents: true,
    canCreateStudents: true,
    canEditStudents: true,
    canDeleteStudents: false,
    canViewReports: true,
    canManageSystem: false,
  },
  PROFESSOR: {
    canViewProfessors: false,
    canCreateProfessors: false,
    canEditProfessors: false,
    canDeleteProfessors: false,
    canViewStudents: true,
    canCreateStudents: false,
    canEditStudents: false,
    canDeleteStudents: false,
    canViewReports: false,
    canManageSystem: false,
  },
  SECRETARIA: {
    canViewProfessors: true,
    canCreateProfessors: true,
    canEditProfessors: true,
    canDeleteProfessors: false,
    canViewStudents: true,
    canCreateStudents: true,
    canEditStudents: true,
    canDeleteStudents: false,
    canViewReports: false,
    canManageSystem: false,
  },
  ALUNO: {
    canViewProfessors: false,
    canCreateProfessors: false,
    canEditProfessors: false,
    canDeleteProfessors: false,
    canViewStudents: false,
    canCreateStudents: false,
    canEditStudents: false,
    canDeleteStudents: false,
    canViewReports: false,
    canManageSystem: false,
  },
  RESPONSAVEL: {
    canViewProfessors: false,
    canCreateProfessors: false,
    canEditProfessors: false,
    canDeleteProfessors: false,
    canViewStudents: false,
    canCreateStudents: false,
    canEditStudents: false,
    canDeleteStudents: false,
    canViewReports: false,
    canManageSystem: false,
  },
}

export function usePermissions() {
  const { userRole } = useAuth()

  const hasPermission = (permission) => {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
      return false
    }
    const hasIt = ROLE_PERMISSIONS[userRole][permission] || false
    return hasIt
  }

  const canAccessProfessors = () => {
    return hasPermission('canViewProfessors')
  }

  const canManageProfessors = () => {
    return hasPermission('canCreateProfessors') || hasPermission('canEditProfessors')
  }

  const canDeleteProfessors = () => {
    return hasPermission('canDeleteProfessors')
  }

  const getUserRole = () => userRole

  const isRole = (role) => userRole === role

  const isAdmin = () => userRole === 'ADMIN'
  const isCoordenador = () => userRole === 'COORDENADOR'
  const isProfessor = () => userRole === 'PROFESSOR'
  const isSecretaria = () => userRole === 'SECRETARIA'
  const isAluno = () => userRole === 'ALUNO'
  const isResponsavel = () => userRole === 'RESPONSAVEL'

  return {
    hasPermission,
    canAccessProfessors,
    canManageProfessors,
    canDeleteProfessors,
    getUserRole,
    isRole,
    isAdmin,
    isCoordenador,
    isProfessor,
    isSecretaria,
    isAluno,
    isResponsavel,
    userRole,
  }
}