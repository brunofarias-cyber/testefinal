#!/bin/bash

# 🚀 Script para gerenciar o projeto em diferentes modos

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🎯 Gerenciador do Projeto NEXO      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo "Escolha uma opção:"
echo ""
echo -e "${GREEN}1)${NC} Desenvolvimento (npm run dev)"
echo "   └─ Frontend: localhost:5173 com Hot Reload"
echo "   └─ Backend: localhost:3000"
echo ""
echo -e "${GREEN}2)${NC} Produção Local (build + start)"
echo "   └─ Tudo em localhost:3000"
echo "   └─ Como será no Render"
echo ""
echo -e "${GREEN}3)${NC} Build apenas (npm run build)"
echo "   └─ Gera pasta dist/"
echo "   └─ Para Render"
echo ""
echo -e "${GREEN}4)${NC} Parar todos os servidores"
echo ""
echo -e "${GREEN}5)${NC} Ver status das portas"
echo ""
echo -e "${GREEN}0)${NC} Sair"
echo ""

read -p "Digite sua escolha (0-5): " choice

case $choice in
    1)
        echo -e "${YELLOW}🔄 Iniciando desenvolvimento...${NC}"
        npm run dev
        ;;
    2)
        echo -e "${YELLOW}🏗️  Fazendo build...${NC}"
        npm run build
        echo ""
        echo -e "${YELLOW}🚀 Iniciando produção...${NC}"
        NODE_ENV=production npm start
        ;;
    3)
        echo -e "${YELLOW}🏗️  Fazendo build...${NC}"
        npm run build
        echo ""
        echo -e "${GREEN}✅ Build completo!${NC}"
        echo "Próximo passo: npm start (ou git push para Render)"
        ;;
    4)
        echo -e "${YELLOW}⏹️  Parando servidores...${NC}"
        pkill -f "npm run dev" 2>/dev/null
        pkill -f "nodemon" 2>/dev/null
        pkill -f "vite" 2>/dev/null
        pkill -f "node server" 2>/dev/null
        echo -e "${GREEN}✅ Servidores parados${NC}"
        ;;
    5)
        echo -e "${BLUE}📊 Status das Portas:${NC}"
        echo ""
        echo -n "Porta 3000: "
        if lsof -i :3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Em uso${NC}"
        else
            echo -e "${RED}❌ Disponível${NC}"
        fi
        echo ""
        echo -n "Porta 5173: "
        if lsof -i :5173 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Em uso${NC}"
        else
            echo -e "${RED}❌ Disponível${NC}"
        fi
        echo ""
        echo -e "${BLUE}URLs:${NC}"
        echo "  Frontend Dev: http://localhost:5173"
        echo "  Backend:      http://localhost:3000"
        echo "  API Health:   http://localhost:3000/api/health"
        ;;
    0)
        echo -e "${BLUE}Até logo!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Opção inválida!${NC}"
        exit 1
        ;;
esac
