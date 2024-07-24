#!/usr/bin/env python3
"""LFUCache module"""

from base_caching import BaseCaching
from collections import defaultdict


class LFUCache(BaseCaching):
    """
    LFUCache defines a LFU caching system
    """

    def __init__(self):
        """Initialize the cache"""
        super().__init__()
        self.frequency = defaultdict(int)
        self.usage_order = []

    def put(self, key, item):
        """
        Add an item in the cache
        """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                self._discard_lfu()
            
            self.cache_data[key] = item
            self.frequency[key] += 1
            self._update_usage(key)

    def get(self, key):
        """
        Get an item by key
        """
        if key is not None and key in self.cache_data:
            self.frequency[key] += 1
            self._update_usage(key)
            return self.cache_data[key]
        return None

    def _discard_lfu(self):
        """
        Discard the least frequently used item
        If there's a tie, use LRU to break it
        """
        min_frequency = min(self.frequency.values())
        lfu_keys = [k for k, v in self.frequency.items() if v == min_frequency]
        
        if len(lfu_keys) == 1:
            lfu_key = lfu_keys[0]
        else:
            # If there's a tie, use LRU
            for key in self.usage_order:
                if key in lfu_keys:
                    lfu_key = key
                    break
        
        del self.cache_data[lfu_key]
        del self.frequency[lfu_key]
        self.usage_order.remove(lfu_key)
        print(f"DISCARD: {lfu_key}")

    def _update_usage(self, key):
        """
        Update the usage order of the keys
        """
        if key in self.usage_order:
            self.usage_order.remove(key)
        self.usage_order.append(key)
