# Etapa 1: compila a aplicação
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["api-aparecida-jau.csproj", "./"]
RUN dotnet restore "api-aparecida-jau.csproj"

COPY . .
RUN dotnet publish "api-aparecida-jau.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: executa a aplicação compilada
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "api-aparecida-jau.dll"]
