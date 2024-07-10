terraform {
  required_providers {
    random = {
      source  = "hashicorp/random"
      version = "3.6.2"
    }

    vercel = {
      source  = "vercel/vercel"
      version = "1.12.0"
    }
  }

  required_version = "~> 1.9"
}
