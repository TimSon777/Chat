﻿using Infrastructure.Abstractions;
using Infrastructure.Implementations;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

// ReSharper disable once CheckNamespace
namespace Microsoft.Extensions.DependencyInjection;

public static class CacheConfiguration
{
    public static IServiceCollection AddCache(this IServiceCollection services, IConfiguration configuration)
    {
        var settings = configuration.GetSettings<CacheSettings>();
        var options = new ConfigurationOptions
        {
            EndPoints = new EndPointCollection
            {
                { settings.Host, settings.Port }
            },
            Password = settings.Password
        };

        var redis = ConnectionMultiplexer.Connect(options);
        services.AddScoped(_ => redis.GetDatabase());
        return services;
    }

    public static IServiceCollection AddCachingService(this IServiceCollection services)
    {
        services.AddScoped<ICachingService, CachingService>();
        return services;
    }
}