# Deno React Application

A modern full-stack application built with Deno and React, supporting both client-side and server-side rendering.

## 🚀 Technology Stack

- Deno
- React
- TypeScript
- Docker
- Oak (Deno web framework)

## 📝 Implementation Details

### Project Structure

```
deno-react-app/
├── src/
│   ├── client/         # React components and client-side code
│   ├── server/         # Server-side code
│   └── shared/         # Shared types and utilities
├── public/            # Static assets
├── Dockerfile        # Docker configuration
├── docker-compose.yml
└── deno.json         # Deno configuration
```

### Key Features

- TypeScript support
- Server-side rendering (SSR)
- Client-side hydration
- Hot module replacement (HMR)
- Docker containerization
- Environment configuration

## 🛠️ Development Setup

### Prerequisites

- Deno 1.37 or higher
- Docker (optional)

### Local Development

1. Clone the repository:

```bash
git clone <repository-url>
cd deno-react-app
```

2. Start the development server:

```bash
deno task dev
```

The application will be available at `http://localhost:8000`

### Running with Docker

1. Build the Docker image:

```bash
docker build -t deno-react-app .
```

2. Run the container:

```bash
docker run -p 8000:8000 deno-react-app
```

### Using Docker Compose:

```bash
docker-compose up
```

## 🔄 SSR vs CSR Mode

### Running with SSR (Server-Side Rendering)

1. Using Deno:

```bash
deno task start:ssr
```

2. Using Docker:

```bash
docker run -p 8000:8000 -e ENABLE_SSR=true deno-react-app
```

### Running without SSR (Client-Side Rendering)

1. Using Deno:

```bash
deno task start:csr
```

2. Using Docker:

```bash
docker run -p 8000:8000 -e ENABLE_SSR=false deno-react-app
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
ENABLE_SSR=true
API_URL=http://localhost:8000/api
```

### Available Scripts

- `deno task dev` - Start development server
- `deno task build` - Build production bundle
- `deno task start:ssr` - Start production server with SSR
- `deno task start:csr` - Start production server without SSR
- `deno task test` - Run tests
- `deno task lint` - Run linter

## 🐳 Docker Configuration

The application includes multi-stage builds to optimize the Docker image size:

1. Development image:

```bash
docker build --target development -t deno-react-app:dev .
```

2. Production image:

```bash
docker build --target production -t deno-react-app:prod .
```

## 📦 Deployment

### Production Deployment Steps

1. Build the production Docker image:

```bash
docker build --target production -t deno-react-app:prod .
```

2. Run the production container:

```bash
docker run -p 8000:8000 -e NODE_ENV=production deno-react-app:prod
```

### Performance Optimization

- Enable compression middleware
- Implement caching strategies
- Use CDN for static assets
- Enable HTTP/2 support

## 🔍 Monitoring and Logging

The application includes:

- Health check endpoints
- Prometheus metrics
- Structured logging
- Error tracking

## 📚 Additional Resources

- [Deno Documentation](https://deno.land/manual)
- [React Documentation](https://reactjs.org/)
- [Docker Documentation](https://docs.docker.com/)

## 📄 License

MIT License
