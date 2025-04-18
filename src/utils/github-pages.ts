/**
 * Utilitário para lidar com o redirecionamento do GitHub Pages
 * Isso é necessário porque o GitHub Pages não suporta nativamente SPAs com rotas
 */

// Função para verificar se estamos no GitHub Pages
export const isGitHubPages = (): boolean => {
    return window.location.hostname.includes("github.io")
  }
  
  // Função para obter o nome do repositório a partir da URL
  export const getRepoName = (): string | null => {
    if (isGitHubPages()) {
      const pathSegments = window.location.pathname.split("/")
      if (pathSegments.length > 1) {
        return pathSegments[1] // O nome do repositório é o primeiro segmento após a barra
      }
    }
    return null
  }
  
  // Função para lidar com o redirecionamento após o carregamento da página
  export const handleGitHubPagesRedirect = (): void => {
    // Verificar se há um caminho armazenado na sessionStorage
    const redirectPath = sessionStorage.getItem("redirectPath")
    if (redirectPath) {
      // Limpar o item da sessionStorage
      sessionStorage.removeItem("redirectPath")
  
      // Obter o nome do repositório
      const repoName = getRepoName()
  
      // Construir o caminho completo para o redirecionamento
      let fullPath = redirectPath
      if (repoName && !fullPath.startsWith(`/${repoName}`)) {
        fullPath = `/${repoName}${fullPath}`
      }
  
      // Redirecionar para o caminho armazenado
      window.history.replaceState(null, "", fullPath)
    }
  }
  